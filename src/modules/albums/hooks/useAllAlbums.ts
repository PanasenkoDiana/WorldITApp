import { useState, useEffect } from "react"
import { PostAlbum } from "../../../shared/types"
import { SERVER_HOST } from "../../../shared/constants"
import { Result } from "../../../shared/types/result"
import { useUserContext } from "../../auth/context/userContext"

export function useAllAlbums(){
    const [ albums, setAlbums ] = useState<PostAlbum[] | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ error, setError ] = useState<string | null>(null)
	const { getToken } = useUserContext()

    async function getAlbums(){
        try {
			setIsLoading(true);
			const token = await getToken()
            const response = await fetch(`${SERVER_HOST}api/albums/all`, {
				headers: { Authorization: `Bearer ${token}` },
			})
            const result: Result<PostAlbum[]> = await response.json();
			if (result.status === "error") {
				console.log(result.message);
				setError(result.message)
			} else {
				// let all_tags: ITag[] = []
				// result.data.map((tag)=>{
				// 	return all_tags.push(tag.name)
				// })

				setAlbums(result.data)
			}

        } catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		} finally {
			setIsLoading(false)
		}
    }

    useEffect(()=>{
        getAlbums()
    }, [])

    return { albums, isLoading, error, refetch: getAlbums }
}