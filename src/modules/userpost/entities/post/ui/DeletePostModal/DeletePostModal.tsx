import { View, Text, TouchableOpacity } from "react-native";
import { Modal } from "../../../../../../shared/ui/modal";
import { styles } from "./DeletePostModal.style";
import { usePost } from "../../../../hooks/usePost";
import { Alert } from "react-native";

interface IDeletePostModal {
	id: bigint;
	title: string;
	isVisible: boolean;
	onClose: () => void;
	setStatus: (status: number) => void;
	onRefresh: () => void;
}

export function DeletePostModal(props: IDeletePostModal) {
	const { deletePost } = usePost();

	async function onSubmit(id: any) {
		props.onClose();
		const result = await deletePost(id);
		// try {
		
		if (result?.status == "success") {
			props.onRefresh();
			Alert.alert("Пост успішно видален!");
		} else {
			Alert.alert("Помилка!", result?.message);
		}

		// } catch (error) {
		// 	props.setStatus(2);
		// }
	}

	// if (!user) {
	// 	return (
	// 		<Modal
	// 			title="Підтвердити дію"
	// 			onClose={props.onClose}
	// 			visible={props.isVisible}
	// 		>
	// 			<View style={styles.container}>
	// 				<Text style={[styles.text, {fontSize: 15}]}>Ви не увійшли до облікового запису</Text>
	// 				<TouchableOpacity
	// 					style={[styles.button, styles.rightButton]}
	// 					onPress={props.onClose}
	// 				>
	// 					<Text style={[styles.rightButtonText, styles.text]}>Ок</Text>
	// 				</TouchableOpacity>
	// 			</View>
	// 		</Modal>
	// 	);
	// }

	return (
		<Modal
			title="Підтвердити дію"
			onClose={props.onClose}
			visible={props.isVisible}
		>
			<View style={styles.container}>
				<Text style={styles.text}>
					Ви дійсно хочете видалити пост: {props.title}?
				</Text>
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.leftButton]}
						onPress={props.onClose}
					>
						<Text style={[styles.leftButtonText, styles.text]}>
							Скасувати
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.rightButton]}
					>
						<Text
							style={[styles.rightButtonText, styles.text]}
							onPress={() => onSubmit(props.id)}
						>
							Підтвердити
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
