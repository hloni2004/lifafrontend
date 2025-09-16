export interface PaymentDTO {
  amount: number;
  paymentMethod: string; // e.g. "BANK_TRANSFER", "CASH"
  paymentDate?: string;
  paymentStatus?: string;
}
