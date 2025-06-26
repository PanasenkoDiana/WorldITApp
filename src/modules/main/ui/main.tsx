import { View, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./main.styles";
import { COLORS } from "../../../shared/ui/colors";
import { useUserContext } from "../../auth/context/userContext";
import { SERVER_HOST } from "../../../shared/constants";
import { DefaultAvatar } from "../../../shared/ui/images";

export function Main() {
	const { user } = useUserContext();

	if (!user) return null;

	// Берем массив аватаров из user_app_profile
	const avatars = user.user_app_profile?.user_app_avatar || [];

	// Берем последний аватар, если есть
	const lastAvatar = avatars.length > 0 ? avatars[avatars.length - 1] : null;

	return (
		<View style={styles.container}>
			<View style={styles.profileSection}>
				{lastAvatar && lastAvatar.image ? (
					<Image
						source={{ uri: `${SERVER_HOST}media/${lastAvatar.image}` }}
						style={styles.avatar}
					/>
				) : (
					<DefaultAvatar style={styles.avatar} />
				)}

				<Text style={styles.fullName}>
					{user.first_name} {user.last_name}
				</Text>
				<Text style={styles.username}>@{user.username}</Text>

				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>0</Text>
						<Text style={styles.statLabel}>дописи</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>0</Text>
						<Text style={styles.statLabel}>читачі</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>0</Text>
						<Text style={styles.statLabel}>друзі</Text>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={[styles.button, styles.confirmButton]}>
						<Text style={styles.buttonText}>Підтвердити</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, styles.deleteButton]}>
						<Text style={[styles.buttonText, styles.deleteButtonText]}>
							Видалити
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
