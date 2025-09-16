import { User } from "./User";

export interface Admin extends User {
    adminLevel: string;
    department: string;
    permissions: string;
}