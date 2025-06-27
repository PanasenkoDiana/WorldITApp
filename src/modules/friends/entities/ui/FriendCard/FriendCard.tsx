import { View, TouchableOpacity, Image, Text } from "react-native";
import { styles } from "./FriendCard.styles";
import { DeleteFriendModal } from "../DeleteFriendModal";
import { useState } from "react";
import { PeopleIcon } from "../../../../../shared/ui/icons";
import { DeleteFriendModalResult } from "../DeleteFriendModalResult";
import { useUserContext } from "../../../../auth/context/userContext";
import { useFriends } from "../../../hooks/useFriends";
import { SERVER_HOST } from "../../../../../shared/constants";
import defaultAvatar from "../../../../../../assets/default_avatar.png";

import { DefaultAvatar } from "../../../../../shared/ui/images";
import { router } from "expo-router";
import { User } from "../../../../../shared/types";

interface IFriendCard extends User {
	variant: "friend" | "request" | "myRequest" | "notFriend" | string;
}

export function FriendCard(props: IFriendCard) {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [resultVisible, setResultVisible] = useState<boolean>(false);
	const [status, setStatus] = useState(0);
	const {
		getAllFriends,
		getRequests,
		getMyRequests,
		getRecommends,
		sendRequest,
		cancelRequest,
		acceptRequest,
	} = useFriends();

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.friendInfo}>
				{props.user_app_profile?.user_app_avatar &&
				props.user_app_profile?.user_app_avatar[props.user_app_profile?.user_app_avatar.length - 1]
					?.image ? (
					<Image
						source={{
							uri: `${SERVER_HOST}media/${
								props.user_app_profile?.user_app_avatar[
									props.user_app_profile?.user_app_avatar.length - 1
								].image
							}`,	
						}}
						style={styles.profileImage}
					/>
				) : (
					<DefaultAvatar style={styles.profileImage} />
				)}

				<View style={styles.names}>
					{props.first_name ? (
						<>
							<Text style={styles.name}>
								{props.first_name} {props.last_name}
							</Text>
							<Text style={styles.username}>
								@{props.username}
							</Text>
						</>
					) : props.last_name ? (
						<>
							<Text style={styles.name}>{props.last_name}</Text>
							<Text style={styles.username}>
								@{props.username}
							</Text>
						</>
					) : (
						<Text style={styles.name}>@{props.username}</Text>
					)}
				</View>
			</TouchableOpacity>

			{props.variant == "friend" && (
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.leftButton]}
						onPress={() =>
							router.push({
								pathname: "/chat",
								params: {
									recipientId: props.id,
									recipientUsername: props.username,
									recipientName:
										`${props.first_name || ""} ${
											props.last_name || ""
										}`.trim() || `@${props.username}`,
								},
							})
						}
					>
						<Text style={styles.leftButtonText}>Повідомлення</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.rightButton]}
						onPress={() => {
							setModalVisible(true);
						}}
					>
						<Text style={styles.rightButtonText}>Видалити</Text>
					</TouchableOpacity>
				</View>
			)}

			{props.variant == "request" && (
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.leftButton]}
						onPress={async () => {
							await acceptRequest(props.username);
						}}
					>
						<Text style={styles.leftButtonText}>Підтвердити</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.rightButton]}
						onPress={async () => {
							await cancelRequest(props.username, true);
						}}
					>
						<Text style={styles.rightButtonText}>Відхилити</Text>
					</TouchableOpacity>
				</View>
			)}

			{props.variant == "myRequest" && (
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.rightButton]}
						onPress={async () => {
							cancelRequest(props.username, false);
						}}
					>
						<Text style={styles.rightButtonText}>Скасувати</Text>
					</TouchableOpacity>
				</View>
			)}

			{props.variant == "notFriend" && (
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.leftButton]}
						onPress={async () => {
							await sendRequest(props.username);
						}}
					>
						<Text style={styles.leftButtonText}>Додати</Text>
					</TouchableOpacity>
				</View>
			)}

			<DeleteFriendModal
				username={props.username}
				isVisible={modalVisible}
				onClose={() => setModalVisible(false)}
				setStatus={setStatus}
			/>
			<DeleteFriendModalResult
				username={props.username}
				onClose={() => {
					setResultVisible(false);
					setStatus(0);
				}}
				isVisible={resultVisible}
				status={status}
			/>
		</View>
	);
}
