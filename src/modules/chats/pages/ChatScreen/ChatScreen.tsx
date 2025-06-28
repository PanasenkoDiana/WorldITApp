import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
	KeyboardAvoidingView,
} from "react-native";
import { Fragment, useRef, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "./ChatScreen.styles";
import {
	ArrowIcon,
	CheckIcon,
	GalleryIcon,
	SendIcon,
} from "../../../../shared/ui/icons";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../shared/ui/colors";
import { DefaultAvatar } from "../../../../shared/ui/images";
import { useRecipient } from "../../hooks/useRecipient";
import { SERVER_HOST } from "../../../../shared/constants";
import { ChatMessage as Message } from "../../../../shared/types";
import { useChat } from "../ChatsHook/Chat.hooks";

export function ChatScreen() {
	const { recipientId, recipientName, recipientUsername } =
		useLocalSearchParams<{
			recipientId: string;
			recipientName: string;
			recipientUsername: string;
		}>();

	const router = useRouter();
	const { getRecipient } = useRecipient();

	// Здесь важно, чтобы useChat возвращал currentUserProfileId — id профиля пользователя
	const {
		grouped,
		newMessage,
		setNewMessage,
		sendMessage,
		thisRecipient,
		currentUserId, // <- id профиля текущего пользователя (user_app_profile.id)
	} = useChat(recipientId, recipientUsername, getRecipient);

	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		if (flatListRef.current && grouped.length > 0) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, [grouped]);

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.headerView}>
					<View style={styles.headerHelp}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<ArrowIcon
								width={20}
								height={20}
								stroke={COLORS.lightGray}
							/>
						</TouchableOpacity>
						<View style={styles.recipientHeader}>
							{thisRecipient?.user_app_avatar.length ? (
								<Image
									source={{
										uri: `${SERVER_HOST}media/${
											thisRecipient.user_app_avatar.at(-1)
												?.image
										}`,
									}}
									style={styles.recipientAvatar}
								/>
							) : (
								<DefaultAvatar style={styles.recipientAvatar} />
							)}
							<Text style={styles.header}>
								{thisRecipient?.auth_user.first_name ?? "Загрузка..."}
							</Text>
						</View>
					</View>
					<Ionicons
						name="ellipsis-vertical"
						size={22}
						color={COLORS.black}
					/>
				</View>

				<FlatList
					ref={flatListRef}
					data={grouped}
					keyExtractor={(_, index) => `date-${index}`}
					
					contentContainerStyle={{ paddingBottom: 16 }}
					renderItem={({ item }) => {
						return (
							<Fragment key={item.date}>
								<View style={styles.dateSeparatorContainer}>
									<Text style={styles.dateSeparatorText}>
										{item.date}
									</Text>
								</View>
								{item.data.map((msg: Message) => {
									const isMyMessage =
										Number(msg.user_app_profile.auth_user.id) === currentUserId;
									return (
										<View
											key={
												msg.id?.toString() ??
												Math.random().toString()
											}
											style={
												isMyMessage
													? styles.myMessage
													: styles.theirMessage
											}
										>
											{/* Аватар собеседника слева, если не мое сообщение */}
											{!isMyMessage &&
											thisRecipient
												?.user_app_avatar?.length ? (
												<Image
													source={{
														uri: `${SERVER_HOST}media/${
															thisRecipient.user_app_avatar.at(
																-1
															)?.image
														}`,
													}}
													style={styles.messageAvatar}
												/>
											) : (
												!isMyMessage && (
													<DefaultAvatar
														style={styles.messageAvatar}
													/>
												)
											)}

											<View
												style={
													isMyMessage
														? styles.myMessageText
														: styles.theirMessageText
												}
											>
												<Text
													style={styles.messageText}
													numberOfLines={10}
													ellipsizeMode="tail"
												>
													{msg.content}
												</Text>
												<View
													style={{
														alignSelf: "flex-end",
														flexDirection: "row",
														alignItems: "center",
														marginTop: 4,
													}}
												>
													<Text style={styles.messageData}>
														{new Date(
															msg.sent_at ?? ""
														).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</Text>
													<CheckIcon width={10} height={10} />
												</View>
											</View>
										</View>
									);
								})}
							</Fragment>
						);
					}}
				/>

				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={50}
				>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							value={newMessage}
							onChangeText={setNewMessage}
							placeholder="Повідомлення"
							multiline
						/>
						<TouchableOpacity style={styles.optionDiv}>
							<GalleryIcon />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.submitButton}
							onPress={sendMessage}
						>
							<SendIcon />
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</View>
		</View>
	);
}
