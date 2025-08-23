export interface LoginAttributes {
    username: string,
    password: string,
}

export interface SignUpAttributes extends LoginAttributes {
    name: string,
}


export interface PageParam {
    after: string | undefined,
    before: string | undefined
}