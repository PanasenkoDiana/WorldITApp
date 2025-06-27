import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { styles } from "./NotificationsPage.styles";
// import { ChatMessage } from "../../types/types";
import { useRouter } from "expo-router";
import { useAllChats } from "../../hooks/useAllChats";
import { SERVER_HOST } from "../../../../shared/constants";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFriends } from "../../../friends/hooks/useFriends";
import { ChatGroup, ChatMessage, User } from "../../../../shared/types";
// import { IGroupChat } from "../../entities/create-group-chat-modal/modal.types";

interface INotificationsPage {
	notifications: ChatMessage[];
}

interface IChat {
	id: number;
	members?: User[];
	messages: { sent_at: string; content: string }[];
	content?: string;
}

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

export function NotificationsPage(props: INotificationsPage) {
	const router = useRouter();
	const { chats } = useAllChats();

	const { friends, getAllFriends } = useFriends();

	const [currentUserId, setCurrentUserId] = useState<number>(-1);

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
	const safeChats: ChatGroup[] = chats ?? [];
	const filteredChats = safeChats.filter((chat: ChatGroup) => {
		if (!currentUserId) return false;

		const member = chat.chat_app_chatgroup_members?.find(
			(m) => Number(m.id) !== currentUserId
		);

		if (!member) return false;

		return friends.some((friend) => friend.id === Number(member.id));
	});

	const sortedChats = [...filteredChats].sort((a, b) => {
		const lastAMsg =
			a.chat_app_chatmessage[a.chat_app_chatmessage.length - 1];
		const lastBMsg =
			b.chat_app_chatmessage[b.chat_app_chatmessage.length - 1];
		return (
			new Date(`${lastBMsg.sent_at}` as string).getTime() -
			new Date(`${lastBMsg.sent_at}`).getTime()
		);
	});

	return (
		<View style={styles.container}>
			<FlatList
				data={sortedChats}
				contentContainerStyle={styles.list}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => {
					const lastMessage =
						item.chat_app_chatmessage[
							item.chat_app_chatmessage.length - 1
						];

					const member = item.chat_app_chatgroup_members?.find(
						m => Number(m.id) !== currentUserId
					);
					if (!member) return null;

					const profileImage =
						member.user_app_profile?.user_app_avatar?.at(-1)?.image;

					return (
						<TouchableOpacity
							onPress={() =>
								router.push({
									pathname: "/chat",
									params: {
										recipientId:
											member.user_app_profile.auth_user
												.id,
										recipientUsername:
											member.user_app_profile.auth_user
												.username,
										recipientName:
											`${
												member.user_app_profile
													.auth_user.first_name || ""
											} ${
												member.user_app_profile
													.auth_user.last_name || ""
											}`.trim() ||
											`@${member.user_app_profile.auth_user.username}`,
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
												{member.user_app_profile
													.auth_user.first_name &&
												member.user_app_profile
													.auth_user.last_name
													? `${member.user_app_profile.auth_user.first_name} ${member.user_app_profile.auth_user.last_name}`
													: member.user_app_profile
															.auth_user.last_name
													? member.user_app_profile
															.auth_user.last_name
													: member.user_app_profile
															.auth_user.username
													? `@${member.user_app_profile.auth_user.username}`
													: ""}
											</Text>
											<Text>{lastMessage?.content}</Text>
										</View>

										<Text style={styles.time}>
											{lastMessage
												? formatMessageTime(
														`${lastMessage.sent_at}`
												  )
												: ""}
										</Text>
									</View>
									<Text style={styles.notificationContent}>
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
