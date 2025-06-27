import { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../shared/constants";
import { useUserContext } from "../../auth/context/userContext";
import { IGroupForm } from "../entities/create-group-chat-modal/modal.types";
import { ChatGroup } from "../../../shared/types";

export function useAllChats() {
	const [chats, setChats] = useState<ChatGroup[] | null>(null);
	const { getToken } = useUserContext();

	async function getAllChats() {
		try {
			const token = await getToken();
			const response = await fetch(`${SERVER_HOST}api/chats/all`, {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});

			const result = await response.json();

			setChats(result);
			return response;
		} catch (err) {
			console.log(err);
		}
	}

	// const chats

	return { chats, getAllChats };
}
