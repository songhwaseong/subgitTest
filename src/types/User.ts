export interface User {
    id: number;
    name: string;
    email: string;
    address: string;
    addressDetail: string;
    regdate: string;
    role: "USER" | "ADMIN";
}

export interface LoginResponse extends User {
    accessToken: string;
}
