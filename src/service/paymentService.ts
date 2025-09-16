import api from "./api";
import { PaymentDTO } from "../types/Payment";

const PAYMENT_URL = "/api/payments";
const PAYMENT_INFO = "/api/payment-info";

export const createPayment = async (payload: PaymentDTO) => {
  const resp = await api.post(PAYMENT_URL, payload);
  return resp.data;
};

export const getPaymentInfo = async () => {
  const resp = await api.get(PAYMENT_INFO);
  return resp.data;
};
