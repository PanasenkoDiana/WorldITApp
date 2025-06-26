export interface IChangeUserPartOne {
    profileImage?: string
    username?: string
}

export interface IChangeUserPartTwo {
    first_name: string
    last_name: string
    date_of_birth: DataView
    email: string
    password: string
    repeatPassword: string
}


export type IChangeUser = IChangeUserPartOne & IChangeUserPartTwo