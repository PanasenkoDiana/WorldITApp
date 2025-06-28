import { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../shared/constants";
import { useUserContext } from "../../auth/context/userContext";
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
			setChats(result as ChatGroup[]);
			return response;
		} catch (err) {
			console.error("Error loading chats", err);
		}
	}

	return { chats, getAllChats };
}
