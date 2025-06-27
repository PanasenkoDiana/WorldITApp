import { User } from "../../../shared/types";

export interface IFriendRequest {
	fromId: number;
	toId: number;
	status: false;
}

export type ICanceledRequest = { status: false };

export type IDeletedRequest = { status: false };

export interface IRequest {
	status: false;
	from: User;
}

export interface IMyRequest {
	status: false;
	to: User;
}
