export interface AuthGroupPermissions {
	id: bigint;
	group_id: number;
	permission_id: number;
	auth_permission: Permission;
	auth_group: Group;
}

export interface ChatGroup {
	id: bigint;
	name: string;
	is_personal_chat: boolean;
	admin_id: bigint;
	avatar?: string;
	user_app_profile: UserAppProfile;
	chat_app_chatgroup_members: ChatGroupMember[];
	chat_app_chatmessage: ChatMessage[];
}

export interface ChatGroupMember {
	id: bigint;
	chatgroup_id: bigint;
	profile_id: bigint;
	chat_app_chatgroup: ChatGroup;
	user_app_profile: UserAppProfile;
}

export interface ChatMessage {
	id: bigint;
	content: string;
	sender_id: Number;
	sent_at: Date;
	author_id: bigint;
	chat_group_id: bigint;
	attached_image?: string;
	user_app_profile: UserAppProfile;
	chat_app_chatgroup: ChatGroup;
}

export interface DjangoAdminLog {
	id: number;
	action_time: Date;
	object_id?: string;
	object_repr: string;
	action_flag: number;
	change_message: string;
	content_type_id?: number;
	user_id: number;
	django_content_type?: DjangoContentType;
	auth_user: User;
}

export interface DjangoContentType {
	id: number;
	app_label: string;
	model: string;
	auth_permission: Permission[];
	django_admin_log: DjangoAdminLog[];
}

export interface DjangoMigration {
	id: bigint;
	app: string;
	name: string;
	applied: Date;
}

export interface DjangoSession {
	session_key: string;
	session_data: string;
	expire_date: Date;
}

export interface PostAlbum {
	id: bigint;
	name: string;
	created_at: Date;
	preview_image?: string;
	shown: boolean;
	topic_id: bigint;
	author_id: bigint;
	user_app_profile: UserAppProfile;
	post_app_tag: PostTag;
	post_app_album_images: AlbumImage[];
}

export interface AlbumImage {
	id: bigint;
	album_id: bigint;
	image_id: bigint;
	post_app_album: PostAlbum;
	post_app_image: PostImage;
}

export interface PostImage {
	id: bigint;
	filename: string;
	file: string;
	uploaded_at: Date;
	post_app_album_images: AlbumImage[];
	post_app_post_images: PostImageInPost[];
}

export interface PostLink {
	id: bigint;
	url: string;
	post_id: bigint;
	post_app_post: Post;
}

export interface Post {
	id: bigint;
	title: string;
	content: string;
	author_id: bigint;
	topic: string;
	post_app_link: PostLink[];
	user_app_profile: UserAppProfile;
	post_app_post_images: PostImageInPost[];
	post_app_post_likes: PostLike[];
	post_app_post_tags: PostTagRelation[];
	post_app_post_views: PostView[];
}

export interface PostImageInPost {
	id: bigint;
	post_id: bigint;
	image_id: bigint;
	post_app_image: PostImage;
	post_app_post: Post;
}

export interface PostLike {
	id: bigint;
	post_id: bigint;
	profile_id: bigint;
	post_app_post: Post;
	user_app_profile: UserAppProfile;
}

export interface PostTagRelation {
	id: bigint;
	post_id: bigint;
	tag_id: bigint;
	post_app_post: Post;
	post_app_tag: PostTag;
}

export interface PostView {
	id: bigint;
	post_id: bigint;
	profile_id: bigint;
	post_app_post: Post;
	user_app_profile: UserAppProfile;
}

export interface PostTag {
	id: bigint;
	name: string;
	post_app_album: PostAlbum[];
	post_app_post_tags: PostTagRelation[];
}

export interface UserAvatar {
	id: bigint;
	image: string;
	active: boolean;
	shown: boolean;
	profile_id: bigint;
	user_app_profile: UserAppProfile;
}

export interface Friendship {
	id: bigint;
	accepted: boolean;
	profile1_id: bigint;
	profile2_id: bigint;
	user_app_profile_user_app_friendship_profile1_idTouser_app_profile: UserAppProfile;
	user_app_profile_user_app_friendship_profile2_idTouser_app_profile: UserAppProfile;
}

export interface UserAppProfile {
	id: bigint;
	date_of_birth: Date;
	user_id: number;
	signature?: string;
	chat_app_chatgroup: ChatGroup[];
	chat_app_chatgroup_members: ChatGroupMember[];
	chat_app_chatmessage: ChatMessage[];
	post_app_album: PostAlbum[];
	post_app_post: Post[];
	post_app_post_likes: PostLike[];
	post_app_post_views: PostView[];
	user_app_avatar: UserAvatar[];
	user_app_friendship_user_app_friendship_profile1_idTouser_app_profile: Friendship[];
	user_app_friendship_user_app_friendship_profile2_idTouser_app_profile: Friendship[];
	auth_user: User;
}

export interface VerificationCode {
	id: bigint;
	username: string;
	code: string;
	created_at: Date;
}

export interface User {
	id: number;
	password: string;
	last_login?: Date;
	is_superuser: boolean;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	is_staff: boolean;
	is_active: boolean;
	date_joined: Date;
	groups: UserGroup[];
	user_permissions: UserPermission[];
	django_admin_log: DjangoAdminLog[];
	user_app_profile: UserAppProfile;
}

export interface Group {
	id: number;
	name: string;
	auth_group_permissions: AuthGroupPermissions[];
	users: UserGroup[];
}

export interface Permission {
	id: number;
	name: string;
	content_type_id: number;
	codename: string;
	django_content_type: DjangoContentType;
	auth_group_permissions: AuthGroupPermissions[];
	user_permissions: UserPermission[];
}

export interface UserGroup {
	user_id: number;
	group_id: number;
	user: User;
	group: Group;
}

export interface UserPermission {
	user_id: number;
	permission_id: number;
	user: User;
	permission: Permission;
}
