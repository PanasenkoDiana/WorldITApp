import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser, IChangeUserPartOne, IChangeUserPartTwo } from "../types";
import { ISecondRegisterForm } from "../ui/second-register-modal/modal.types";
import { SERVER_HOST } from "../../../shared/constants";
import { Result } from "../../../shared/types/result";

export function authUser(setUser: (user: IUser | null) => void, setToken: (token: string | null) => void) {
	async function getData(token: string): Promise<Result<IUser>> {
		try {
			const response = await fetch(`${SERVER_HOST}api/user/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const result: Result<IUser> = await response.json();

			if (result.status === "error") {
				return result;
			}

			// alert(JSON.stringify(result))
			setUser(result.data);
			console.log(5);
			console.log(result.data);

			return result;
		} catch (error) {
			console.error("Ошибка в getData:", error);
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function login(
		email: string,
		password: string
	): Promise<Result<string>> {
		try {
			const response = await fetch(`${SERVER_HOST}api/user/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const json = await response.json();
			// console.log(JSON.stringify(json))

			// if (!response.ok || !json.token) {
			// 	return { status: "error", message: "Invalid credentials" };
			// }


			await AsyncStorage.setItem("token", json.data);
			await getData(json.data);

			console.log(`Token: ${json.data}`);

			setToken(json.data)

			return { status: "success", data: json.data };
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function register(
		email: string,
		password: string
	): Promise<Result<string>> {
		try {
			const response = await fetch(
				`${SERVER_HOST}api/user/register/start`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			const result: Result<string> = await response.json();

			if (result.status === "error") {
				return result;
			}

			return result;
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function verifyUser(
		email: string,
		code: string
	): Promise<Result<string>> {
		try {
			const response = await fetch(
				`${SERVER_HOST}api/user/register/confirm`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, code }),
				}
			);

			const result: Result<string> = await response.json();

			if (result.status === "error") {
				return result;
			}

			await AsyncStorage.setItem("token", result.data);
			await getData(result.data);
			console.log(`Token: ${result.data}`);
			setToken(result.data)

			return result;
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function addSecondUserInfo(
		data: ISecondRegisterForm,
		id: number
	): Promise<Result<IUser>> {
		try {
			const response = await fetch(
				`${SERVER_HOST}api/user/register/second/${id}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			const result: Result<IUser> = await response.json();

			if (result.status === "error") {
				return result;
			}

			setUser(result.data);
			return result;
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function changeUserPartOne(
		data: IChangeUserPartOne
	): Promise<Result<IUser>> {
		try {
			console.log("Changing user part one with data:", data);
			const token = await AsyncStorage.getItem("token");
			const response = await fetch(
				`${SERVER_HOST}api/user/change/part-one`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(data),
				}
			);

			const result: Result<IUser> = await response.json();

			if (result.status === "error") {
				return result;
			}

			// setUser(result.data);
			return result;
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	async function changeUserPartTwo(
		data: IChangeUserPartTwo
	): Promise<Result<IUser>> {
		try {
			const token = await AsyncStorage.getItem("token");
			const { repeatPassword, ...newData } = data;

			const response = await fetch(
				`${SERVER_HOST}api/user/change/part-two`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(newData),
				}
			);

			const result: Result<IUser> = await response.json();

			if (result.status === "error") {
				return result;
			}

			// setUser(result.data);
			return result;
		} catch (error) {
			return { status: "error", message: "An unexpected error occurred" };
		}
	}

	return {
		getData,
		login,
		register,
		verifyUser,
		addSecondUserInfo,
		changeUserPartOne,
		changeUserPartTwo,
	};
}
