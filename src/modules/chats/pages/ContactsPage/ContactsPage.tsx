import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Image,
	ScrollView,
} from "react-native";
// import { Contact } from "../../types/types";
import { styles } from "./ContactsPage.styles";
import { Input } from "../../../../shared/ui/input";
import { SearchIcon } from "../../../../shared/ui/icons";
import { COLORS } from "../../../../shared/ui/colors";
import { useState } from "react";
// import { IUser } from "../../../auth/types";
import { SERVER_HOST } from "../../../../shared/constants";
import { DefaultAvatar } from "../../../../shared/ui/images";
import { useRouter } from "expo-router";
import { User } from "../../../../shared/types";
interface ContactsPageProps {
	contacts: User[];
}

export function ContactsPage(props: ContactsPageProps) {
	const [searchText, setSearchText] = useState("");
	const router = useRouter();

	const lowerInput = searchText.toLowerCase();

	const filteredContacts = props.contacts
		.map((contact) => {
			const fullName =
				contact.first_name && contact.last_name
					? `${contact.first_name} ${contact.last_name}`.toLowerCase()
					: "";

			if (lowerInput.includes("@")) {
				let username = `@${contact.username}`;
				let lower = lowerInput.replace("@", "");
				if (username.toLowerCase().includes(lower)) {
					return contact;
				} else {
					return null;
				}
			} else {
				if (
					(contact.first_name &&
						contact.first_name.toLowerCase().includes(lowerInput)) ||
					(contact.last_name &&
						contact.last_name.toLowerCase().includes(lowerInput)) ||
					contact.username.toLowerCase().includes(lowerInput) ||
					fullName.includes(lowerInput)
				) {
					return contact;
				} else {
					return null;
				}
			}
		})
		.filter((contact) => contact !== null);

	const sortedContacts = filteredContacts.sort((a, b) => {
		const nameA = a.first_name || "";
		const nameB = b.first_name || "";
		const surnameA = a.last_name || "";
		const surnameB = b.last_name || "";
		const usernameA = a.username || "";
		const usernameB = b.username || "";

		const priorityA = nameA ? 0 : surnameA ? 1 : 2;
		const priorityB = nameB ? 0 : surnameB ? 1 : 2;

		if (priorityA !== priorityB) {
			return priorityA - priorityB;
		}

		if (nameA > nameB) return 1;
		if (nameA < nameB) return -1;

		if (surnameA > surnameB) return 1;
		if (surnameA < surnameB) return -1;

		if (usernameA > usernameB) return 1;
		if (usernameA < usernameB) return -1;

		return 0;
	});

	return (
		<View style={styles.container}>
			<Input
				rightIcon={<SearchIcon fill={COLORS.gray} />}
				placeholder="Пошук"
				onChangeText={setSearchText}
				value={searchText}
			/>
			<FlatList
				data={sortedContacts}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.contact}
						onPress={() => {
							console.log('bebroy: ', item)
							router.push( {
								pathname:"/chat",
								params:{
								recipientId: item.id,
								recipientUsername: item.username,
								recipientName: `${
									item.first_name || ""
								} ${item.last_name || ""}`.trim() || `@${item.username}`,},
							})}
						}
					>
						{item.user_app_profile.user_app_avatar.length > 0 &&
						item.user_app_profile.user_app_avatar[item.user_app_profile.user_app_avatar.length - 1]
							?.image ? (
							<Image
								source={{
									uri: `${SERVER_HOST}media/${
										item.user_app_profile.user_app_avatar[
											item.user_app_profile.user_app_avatar.length - 1
										].image
									}`,
								}}
								style={styles.contactImage}
							/>
						) : (
							<DefaultAvatar style={styles.contactImage} />
						)}
						<View style={styles.contactInfo}>
							{item.first_name || item.last_name ? (
								item.first_name ? (
									<>
										<Text style={styles.contactName}>
											{item.first_name} {item.last_name || ""}
										</Text>
										<Text style={styles.contactUsername}>
											@{item.username}
										</Text>
									</>
								) : (
									<>
										<Text style={styles.contactName}>
											{item.last_name}
										</Text>
										<Text style={styles.contactUsername}>
											@{item.username}
										</Text>
									</>
								)
							) : (
								<Text style={styles.contactName}>
									@{item.username}
								</Text>
							)}
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}
