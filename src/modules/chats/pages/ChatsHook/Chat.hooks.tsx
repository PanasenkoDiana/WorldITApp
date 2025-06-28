import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import { SERVER_HOST } from "../../../../shared/constants";
import { ChatMessage as Message, User } from "../../../../shared/types";
import { ProfileWithUser } from "../../../auth/types";

const SOCKET_URL = SERVER_HOST;

export type MessageLocal = {
	id?: number;
	content: string;
	senderId: number;
	chatGroupId?: number;
	sentAt?: string;
};

export type GroupedMessage = {
	date: string;
	data: Message[];
};

export function useChat(
	recipientId?: string,
	recipientUsername?: string,
	getRecipient?: (id: number) => Promise<{ data?: ProfileWithUser | null }>
) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [chatGroupId, setChatGroupId] = useState<number | null>(null);
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);
	const [thisRecipient, setThisRecipient] = useState<ProfileWithUser | null>(
		null
	);
	const socketRef = useRef<Socket | null>(null);

	const savedRecipientUsername = useRef<string | undefined>(undefined);
	const savedRecipientId = useRef<string | undefined>(undefined);

	useEffect(() => {
		async function fetchRecipient() {
			if (
				!recipientId ||
				savedRecipientId.current === recipientId ||
				!getRecipient
			)
				return;

			savedRecipientId.current = recipientId;

			const result = await getRecipient(+recipientId);
			if (result?.data) setThisRecipient(result.data);
		}
		fetchRecipient();
	}, [recipientId, getRecipient]);

	useEffect(() => {
		const loadUserId = async () => {
			const token = await AsyncStorage.getItem("token");
			if (!token) return;
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				setCurrentUserId(payload.id);
			} catch (err) {
				console.warn("Ошибка при чтении токена:", err);
			}
		};
		loadUserId();
	}, []);

	useEffect(() => {
		if (
			!recipientUsername ||
			savedRecipientUsername.current === recipientUsername
		)
			return;

		savedRecipientUsername.current = recipientUsername;

		async function initChatGroup() {
			try {
				const token = await AsyncStorage.getItem("token");
				const response = await fetch(
					`${SERVER_HOST}api/chats/get-or-create-group`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...(token
								? { Authorization: `Bearer ${token}` }
								: {}),
						},
						body: JSON.stringify({ recipientId }),
					}
				);

				const data = await response.json();
				if (response.ok) {
					setChatGroupId(data.chatGroupId);
				} else {
					alert("Ошибка инициализации чата: " + data.error);
				}
			} catch (e) {
				console.error("Ошибка при получении chatGroupId", e);
			}
		}

		initChatGroup();
	}, [recipientUsername]);

	useEffect(() => {
		if (!chatGroupId) return;

		async function fetchHistory() {
			try {
				const token = await AsyncStorage.getItem("token");
				const response = await fetch(
					`${SERVER_HOST}api/chats/messages/${chatGroupId}`,
					{
						headers: {
							...(token
								? { Authorization: `Bearer ${token}` }
								: {}),
						},
					}
				);

				if (response.ok) {
					const data = await response.json();

					// Маппим сообщения в ожидаемый формат
					const sorted = data
						.map((msg: any) => ({
							id: msg.id,
							content: msg.content,
							author_id: Number(msg.author_id), // здесь auth_user может отсутствовать, берём напрямую author_id
							chat_group_id: Number(msg.chat_group_id),
							sent_at: msg.sent_at,
							user_app_profile: msg.user_app_profile,
						}))
						.sort(
							(a: Message, b: Message) =>
								new Date(a.sent_at).getTime() -
								new Date(b.sent_at).getTime()
						);

					setMessages(sorted);
				}
			} catch (e) {
				console.error("Ошибка получения истории чата", e);
			}
		}

		fetchHistory();
	}, [chatGroupId]);

	useEffect(() => {
		if (!chatGroupId) return;

		socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
		socketRef.current.emit("join_group", chatGroupId);

		socketRef.current.on("group_message", (msg: any) => {
			// Приводим к числу для сравнения
			if (Number(msg.chat_group_id) === chatGroupId) {
				setMessages((prev) => [
					...prev,
					{
						...msg,
						author_id: Number(msg.author_id),
						chat_group_id: Number(msg.chat_group_id),
					},
				]);
			}
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [chatGroupId]);

	const sendMessage = async () => {
		if (!newMessage.trim() || !chatGroupId || currentUserId === null)
			return;

		const token = await AsyncStorage.getItem("token");

		const response = await fetch(`${SERVER_HOST}api/chats/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({
				content: newMessage,
				chatGroupId,
			}),
		});

		if (!response.ok) {
			const err = await response.text();
			alert("Ошибка отправки: " + err);
			return;
		}

		// Не надо локально добавлять сообщение!
		setNewMessage("");

		// Ждем, пока сервер сам разошлет его через Socket.io
	};
	function formatTime(isoString?: string): string {
		if (!isoString) return "";
		const date = new Date(isoString);
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function formatDate(isoString?: string): string {
		if (!isoString) return "";
		const date = new Date(isoString);
		return date.toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "long",
		});
	}

	function groupMessagesByDate(messages: Message[]): GroupedMessage[] {
		const groups: { [key: string]: Message[] } = {};

		messages.forEach((msg) => {
			const date = formatDate(String(msg.sent_at));
			if (!groups[date]) groups[date] = [];
			groups[date].push(msg);
		});

		return Object.entries(groups).map(([date, data]) => ({ date, data }));
	}

	const grouped = groupMessagesByDate(messages);

	return {
		messages,
		newMessage,
		setNewMessage,
		sendMessage,
		grouped,
		thisRecipient,
		currentUserId,
	};
}
