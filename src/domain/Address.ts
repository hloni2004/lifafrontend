export interface Address {
    addressId?: number;
    buildingName: string,
    unitNumber: number,
    poBoxNumber: number,
    street: string;
    municipality: string;
    province: string;
    postalCode: string;
    country: string;
    propertyNumber?: number;
}
