import { User } from "./User";

export interface Employee extends User {
    position: string;
    staffDiscount: number;
}
