import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Modal,
	Alert,
	Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { styles } from "./PostCard.styles";
import { COLORS } from "../../../../../../shared/ui/colors";
import { IImage, ITag } from "../../../../types";
import { SERVER_HOST } from "../../../../../../shared/constants";
import { useUserContext } from "../../../../../auth/context/userContext";
import { IUser } from "../../../../../auth/types";
import { usePost } from "../../../../hooks";
import { Post } from "../../../../../../shared/types";
import { DeletePostModal } from "../DeletePostModal";
import { Link } from "expo-router";
import { DefaultAvatar } from "../../../../../../shared/ui/images";

interface IPostCardProps extends Post {
	onRefresh: () => void;
}

export function PostCard(props: IPostCardProps) {
	const [modalVisible, setModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] =
		useState<boolean>(false);
	const [resultVisible, setResultVisible] = useState<boolean>(false);
	const [status, setStatus] = useState(0);

	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
	const threeDotsRef = useRef(null);

	const openMenu = () => {
		if (threeDotsRef.current) {
			(threeDotsRef.current as any).measure(
				(
					_fx: number,
					_fy: number,
					_width: number,
					height: number,
					_px: number,
					py: number
				) => {
					setMenuPosition({ top: py + height - 40, right: 30 });
					setModalVisible(true);
				}
			);
		} else {
			setModalVisible(true);
		}
	};

	// Определяем, существует ли аватар и получаем последний
	const userAvatar =
		props.user_app_profile.user_app_avatar &&
		props.user_app_profile.user_app_avatar.length > 0
			? props.user_app_profile.user_app_avatar[
					props.user_app_profile.user_app_avatar.length - 1
			  ]
			: null;

	return (
		<View style={styles.cardContainer}>
			<View style={styles.userInfo}>
				{/* Используем переменную userAvatar здесь */}
				{userAvatar ? (
					<Image
						source={{
							uri: `${SERVER_HOST}media/${userAvatar.image}`,
						}}
						style={styles.avatar}
					/>
				) : (
					<DefaultAvatar style={styles.avatar} />
				)}

				<View>
					{props.user_app_profile.auth_user.first_name ||
					props.user_app_profile.auth_user.last_name ? (
						props.user_app_profile.auth_user.first_name ? (
							<>
								<Text style={styles.fullName}>
									{props.user_app_profile.auth_user.first_name}{" "}
									{props.user_app_profile.auth_user.last_name || ""}
								</Text>
							</>
						) : (
							<>
								<Text style={styles.fullName}>
									{props.user_app_profile.auth_user.last_name}
								</Text>
							</>
						)
					) : (
						<Text style={styles.fullName}>
							@{props.user_app_profile.auth_user.username}
						</Text>
					)}
				</View>

				<TouchableOpacity
					ref={threeDotsRef}
					style={{ marginLeft: "auto", padding: 8 }}
					onPress={openMenu}
				>
					<Ionicons
						name="ellipsis-vertical"
						size={22}
						color={COLORS.black}
					/>
				</TouchableOpacity>
			</View>
			<View>
				<Text style={styles.postTitle}>{props.title}</Text>
				<View style={styles.textInfo}>
					<Text style={styles.postDescription}>{props.content}</Text>
					{props.post_app_post_tags &&
						props.post_app_post_tags.length > 0 && (
							<Text style={styles.postTags}>
								{props.post_app_post_tags?.map(
									(tag) => `${tag.post_app_tag.name} `
								)}
							</Text>
						)}
				</View>
				<View>
					{props.post_app_post_images &&
						props.post_app_post_images.length > 0 && (
							<View style={styles.images}>
								<View style={styles.imageGrid}>
									{props.post_app_post_images
										.slice(0, 3)
										.map((image) => {
											const imagesCount =
												props.post_app_post_images?.length;

											let imageStyle = styles.gridImage;
											if (imagesCount === 1)
												imageStyle = styles.fullWidthImage;
											else if (imagesCount === 2)
												imageStyle = styles.halfWidthImage;

											return (
												<Image
													key={image.id}
													source={{
														uri: `${SERVER_HOST}media/${image.post_app_image.filename}`,
													}}
													style={imageStyle}
													resizeMode="cover"
												/>
											);
										})}
								</View>

								<View style={styles.imageGrid}>
									{props.post_app_post_images
										.slice(4, 7)
										.map((image) => {
											const imagesCount =
												props.post_app_post_images?.length;

											let imageStyle = styles.gridImage;
											if (imagesCount === 1)
												imageStyle = styles.fullWidthImage;
											else if (imagesCount === 2)
												imageStyle = styles.halfWidthImage;

											return (
												<Image
													key={image.id}
													source={{
														uri: `${SERVER_HOST}media/${image.post_app_image.filename}`,
													}}
													style={imageStyle}
													resizeMode="cover"
												/>
											);
										})}
								</View>
								<View style={styles.imageGrid}>
									{props.post_app_post_images
										.slice(6, 9)
										.map((image) => {
											const imagesCount =
												props.post_app_post_images?.length;

											let imageStyle = styles.gridImage;
											if (imagesCount === 1)
												imageStyle = styles.fullWidthImage;
											else if (imagesCount === 2)
												imageStyle = styles.halfWidthImage;

											return (
												<Image
													key={image.id}
													source={{
														uri: `${SERVER_HOST}media/${image.post_app_image.filename}`,
													}}
													style={imageStyle}
													resizeMode="cover"
												/>
											);
										})}
								</View>

								<View style={styles.imageGrid}>
									{props.post_app_post_images
										.slice(9)
										.map((image) => {
											const imagesCount =
												props.post_app_post_images?.length;

											let imageStyle = styles.gridImage;
											if (imagesCount === 1)
												imageStyle = styles.fullWidthImage;
											else if (imagesCount === 2)
												imageStyle = styles.halfWidthImage;

											return (
												<Image
													key={image.id}
													source={{
														uri: `${SERVER_HOST}media/${image.post_app_image.filename}`,
													}}
													style={imageStyle}
													resizeMode="cover"
												/>
											);
										})}
								</View>
							</View>
						)}

					<View style={styles.statsContainer}>
						<View style={styles.statItem}>
							<Ionicons
								name="heart-outline"
								size={16}
								color={COLORS.black}
							/>
							<Text style={styles.statLabel}>
								{props.post_app_post_likes?.length || 0} вподобань
							</Text>
						</View>
						<View style={styles.statItem}>
							<Ionicons
								name="eye-outline"
								size={16}
								color={COLORS.black}
							/>
							<Text style={styles.statLabel}>
								{props.post_app_post_views?.length || 0} переглядів
							</Text>
						</View>
					</View>
				</View>
			</View>

			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					style={{ flex: 1 }}
					activeOpacity={1}
					onPress={() => setModalVisible(false)}
				>
					<View
						style={{
							position: "absolute",
							top: menuPosition.top,
							right: menuPosition.right,
							backgroundColor: "#f6f3fa",
							borderRadius: 12,
							padding: 12,
							shadowColor: "#000",
							shadowOpacity: 0.15,
							shadowRadius: 8,
							elevation: 5,
							minWidth: 180,
						}}
					>
						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								paddingVertical: 8,
							}}
							onPress={() => {
								setModalVisible(false);
								Alert.alert(
									"Редагування",
									"Функція редагування поки що не реалізована"
								);
							}}
						>
							<Ionicons
								name="pencil-outline"
								size={18}
								color={COLORS.black}
								style={{ marginRight: 8 }}
							/>
							<Text style={{ fontSize: 16, color: COLORS.black }}>
								Редагувати допис
							</Text>
						</TouchableOpacity>

						<View
							style={{
								height: 1,
								backgroundColor: COLORS.lightGray,
								marginVertical: 4,
							}}
						/>

						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								paddingVertical: 8,
							}}
							onPress={() => {
								setDeleteModalVisible(true);
								setModalVisible(false);
							}}
						>
							<Ionicons
								name="trash-outline"
								size={18}
								color={COLORS.error}
								style={{ marginRight: 8 }}
							/>
							<Text style={{ fontSize: 16, color: COLORS.error }}>
								Видалити публікацію
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<DeletePostModal
				id={props.id}
				title={props.title}
				isVisible={deleteModalVisible}
				onClose={() => setDeleteModalVisible(false)}
				setStatus={setStatus}
				onRefresh={props.onRefresh}
			/>
		</View>
	);
}