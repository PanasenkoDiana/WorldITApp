import { User } from "../../../shared/types"
import { Avatar } from "./avatar"




export interface Profile {
//     id            Int      @id @default(autoincrement())
//   user          User     @relation(fields: [user_id], references: [id])
//   user_id       Int      @unique
//   date_of_birth DateTime
//   signature     String? // путь к изображению или null

//   avatars Avatar[]

//   posts_viewed Post[] @relation("PostViews")
//   posts_liked  Post[] @relation("PostLikes")
    id: number
    user_id: number
    date_of_birth: string
    signature: string | null
    avatars: Avatar[]
    posts_viewed: number[]
    posts_liked: number[]
}


export interface ProfileWithUser {
//     id            Int      @id @default(autoincrement())
//   user          User     @relation(fields: [user_id], references: [id])
//   user_id       Int      @unique
//   date_of_birth DateTime
//   signature     String? // путь к изображению или null

//   avatars Avatar[]

//   posts_viewed Post[] @relation("PostViews")
//   posts_liked  Post[] @relation("PostLikes")
    id: number
    user_id: number
    date_of_birth: string
    signature: string | null
    user_app_avatar: Avatar[]
    auth_user: User
    // posts_viewed: number[]
    // posts_liked: number[]
}