import { User } from "./User";

export interface Customer extends User {
    customerDiscount: number;
}
