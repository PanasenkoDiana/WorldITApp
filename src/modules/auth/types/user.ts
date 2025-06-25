import { IAlbum } from "../../albums/types"
import { IImage } from "../../userpost/types"
import { Profile } from "./profile"

export interface IUser {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
	date_joined: string;
	last_login: string | null;
	user_app_profile: {
		id: number;
		user_id: number;
		date_of_birth: string;
		signature?: string | null;
		user_app_avatar: {
			id: number;
			profile_id: number;
			image: string;
			active: boolean;
			shown: boolean;
		}[];
	};
}
