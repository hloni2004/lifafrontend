import {Address} from "./Address";
import {Contact} from "./Contact";

export interface User {
    userId: number;
    address: Address;
    contact: Contact;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role: string;
}