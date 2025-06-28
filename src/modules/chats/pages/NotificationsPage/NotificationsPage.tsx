import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { styles } from "./NotificationsPage.styles";
import { useRouter } from "expo-router";
import { useAllChats } from "../../hooks/useAllChats";
import { SERVER_HOST } from "../../../../shared/constants";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFriends } from "../../../friends/hooks/useFriends";
import { ChatGroup, ChatMessage } from "../../../../shared/types";

function formatMessageTime(isoString: string): string {
	const messageDate = new Date(isoString);
	const now = new Date();

	const isToday =
		messageDate.getDate() === now.getDate() &&
		messageDate.getMonth() === now.getMonth() &&
		messageDate.getFullYear() === now.getFullYear();

	return isToday
		? messageDate.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
		  })
		: messageDate.toLocaleDateString("ru-RU");
}

function getLastMessage(chat: ChatGroup): ChatMessage | null {
	if (!chat.chat_app_chatmessage.length) return null;
	return chat.chat_app_chatmessage.reduce((latest, current) => {
		const latestTime = new Date(String(latest.sent_at)).getTime();
		const currentTime = new Date(String(current.sent_at)).getTime();
		return currentTime > latestTime ? current : latest;
	}, chat.chat_app_chatmessage[0]);
}

export function NotificationsPage() {
	const router = useRouter();
	const { chats, getAllChats } = useAllChats();
	const { friends } = useFriends();
	const [currentUserId, setCurrentUserId] = useState<number>(0);

	useEffect(() => {
		getAllChats();
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

	const safeChats: ChatGroup[] = Array.isArray(chats) ? chats : [];

	// фильтруем только личные чаты
	const filteredChats = safeChats.filter((chat) => {
		if (!currentUserId || !chat.is_personal_chat) return;
		const otherMember = chat.chat_app_chatgroup_members?.find(
			(m) => m.user_app_profile?.auth_user?.id !== currentUserId
		);
		return !!otherMember;
	});

	console.log("filtered chats: ", filteredChats);

	// добавляем lastMessage
	const chatsWithLastMessage = filteredChats
		.map((chat) => ({
			...chat,
			lastMessage: getLastMessage(chat),
		}))
		.filter(
			(chat) =>
				!!chat.lastMessage &&
				Number(chat.lastMessage.author_id) !== currentUserId
		);

	// убираем дубли
	const uniqueChatsMap = new Map<
		string,
		(typeof chatsWithLastMessage)[number]
	>();

	for (const chat of chatsWithLastMessage) {
		const otherMember = chat.chat_app_chatgroup_members.find(
			(m) => m.user_app_profile?.auth_user?.id !== currentUserId
		);
		if (!otherMember) continue;

		const otherId = otherMember.user_app_profile?.auth_user?.id;
		if (!otherId) continue;

		const key =
			currentUserId < otherId
				? `${currentUserId}-${otherId}`
				: `${otherId}-${currentUserId}`;

		const existing = uniqueChatsMap.get(key);
		if (
			!existing ||
			new Date(String(chat.lastMessage!.sent_at)) >
				new Date(String(existing.lastMessage!.sent_at))
		) {
			uniqueChatsMap.set(key, chat);
		}
	}

	const deduplicatedChats = Array.from(uniqueChatsMap.values()).sort(
		(a, b) => {
			const aTime = new Date(String(a.lastMessage!.sent_at)).getTime();
			const bTime = new Date(String(b.lastMessage!.sent_at)).getTime();
			return bTime - aTime;
		}
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={deduplicatedChats}
				contentContainerStyle={styles.list}
				keyExtractor={(item) => item.id.toString()}
				ListEmptyComponent={
					<View style={{ padding: 20 }}>
						<Text style={{ textAlign: "center", color: "#aaa" }}>
							Повідомлень немає
						</Text>
					</View>
				}
				renderItem={({ item }) => {
					const lastMessage = item.chat_app_chatmessage.pop();
					if (!lastMessage) {
						return null;
					}

					const member = item.chat_app_chatgroup_members.find(
						(m) =>
							m.user_app_profile?.auth_user?.id !== currentUserId
					);
					if (!member || !member.user_app_profile?.auth_user)
						return null;

					const profile = member.user_app_profile;
					const authUser = profile.auth_user;
					const profileImage = profile.user_app_avatar?.at(-1)?.image;

					console.log("profile:", profile);
					console.log("authUser:", authUser);
					console.log("profileImage:", profileImage);

					const name =
						authUser.first_name || authUser.last_name
							? `${authUser.first_name ?? ""} ${
									authUser.last_name ?? ""
							  }`.trim()
							: `@${authUser.username}`;

					return (
						<TouchableOpacity
							onPress={() =>
								router.push({
									pathname: "/chat",
									params: {
										recipientId: Number(
											member.user_app_profile.id
										),
										recipientUsername: authUser.username,
										recipientName: name,
									},
								})
							}
						>
							<View style={styles.notification}>
								<View>
									{profileImage ? (
										<Image
											source={{
												uri: `${SERVER_HOST}media/${profileImage}`,
											}}
											style={styles.contactImage}
										/>
									) : (
										<View
											style={
												styles.contactImagePlaceholder
											}
										/>
									)}
								</View>
								<View style={styles.infoContainer}>
									<View style={styles.nameContainer}>
										<View>
											<Text style={styles.contactName}>
												{name}
											</Text>
										</View>
										<Text style={styles.time}>
											{formatMessageTime(
												String(lastMessage?.sent_at)
											)}
										</Text>
									</View>
									<Text
										style={styles.notificationContent}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{lastMessage.content}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				}}
			/>
		</View>
	);
}
