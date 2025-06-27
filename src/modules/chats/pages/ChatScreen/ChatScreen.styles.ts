import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../../../shared/ui/colors";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		borderColor: COLORS.lightGray,
		backgroundColor: COLORS.white,
	},
	header: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
		color: "#222",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
		paddingVertical: 6,
		borderTopWidth: 1,
		gap: 5,
		borderColor: "#eee",
		backgroundColor: "#fafafa",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 8,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	optionDiv: {
		width: 40,
		height: 40,
		borderColor: COLORS.black,
		borderWidth: 1,
		borderRadius: 1000,
		justifyContent: "center",
		alignItems: "center",
	},
	submitButton: {
		height: 40,
		backgroundColor: COLORS.darkPlum,
		borderRadius: 30,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		gap: 10,
	},

	headerView: {
		width: "97%",
		borderColor: COLORS.lightGray,
		borderBottomWidth: 1,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 5,
	},

	backButton: {},

	recipientHeader: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "center",
		gap: 10,
	},

	recipientAvatar: {
		width: 40,
		height: 40,
		borderRadius: 50,
	},

	headerHelp: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},

	myMessage: {
		alignSelf: "flex-end",
		flexDirection: "row",
		maxWidth: screenWidth * 0.85,
		marginVertical: 4,
		gap: 5,
	},

	theirMessage: {
		alignSelf: "flex-start",
		flexDirection: "row",
		maxWidth: screenWidth * 0.85,
		marginVertical: 4,
		gap: 5,
	},

	messageAvatar: {
		width: 40,
		height: 40,
		borderRadius: 50,
	},

	myMessageText: {
		backgroundColor: COLORS.lightGray,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 12,
		maxWidth: screenWidth * 0.7,
		alignSelf: "flex-end",
		flexShrink: 1,
	},

	theirMessageText: {
		borderColor: COLORS.lightGray,
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 12,
		maxWidth: screenWidth * 0.7,
		alignSelf: "flex-start",
		flexShrink: 1,
	},

	messageText: {
		fontSize: 16,
		fontFamily: "GTWalsheimPro-Regular",
		flexWrap: "wrap",
	},

	messageData: {
		fontSize: 10,
		fontFamily: "GTWalsheimPro-Regular",
		alignSelf: "flex-end",
		marginHorizontal: 5,
		marginBottom: 5,
	},

	dateSeparatorContainer: {
		alignItems: "center",
		marginVertical: 10,
	},
	dateSeparatorText: {
		fontSize: 14,
		color: COLORS.gray,
	},
});
