import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { createPayment, getPaymentInfo } from "../service/paymentService";
import { PaymentDTO } from "../types/Payment";

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPaymentInfo().then(setBankInfo).catch(() => setBankInfo(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      setMessage("Cart is empty");
      return;
    }

    const payload: PaymentDTO = {
      amount: parseFloat(total.toFixed(2)),
      paymentMethod: method,
      paymentStatus: method === "CASH" ? "COMPLETED" : "PENDING"
    };

    try {
      const created = await createPayment(payload);
      // you can send the payment confirmation to backend / email or save order
      clearCart();
      setMessage(`Payment created (id ${created.paymentId}). Follow instructions for ${method}.`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create payment. See console.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br />
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Payment method</label><br />
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="BANK_TRANSFER">Bank transfer / EFT</option>
            <option value="CASH">Cash on collection</option>
            <option value="CRYPTOCURRENCY">Cryptocurrency</option>
          </select>
        </div>
          <div style={{ marginTop: 12 }}>
              <strong>Order total:</strong>{" "}
              <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
    R{total.toFixed(2)}
  </span>
          </div>


        {method === "BANK_TRANSFER" && bankInfo && (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
            <h4>Bank transfer instructions</h4>
            <div>Account name: {bankInfo.accountName}</div>
            <div>Account number: {bankInfo.accountNumber}</div>
            <div>Branch code: {bankInfo.branchCode}</div>
            <p>Please use your order number or email as reference. After transfer, upload proof or contact support.</p>
          </div>
        )}

        {method === "CRYPTOCURRENCY" && bankInfo && (
          <div style={{ marginTop: 12 }}>
            <h4>Crypto address</h4>
            <div>{bankInfo.cryptoAddress}</div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button type="submit">Place order / Create payment</button>
        </div>
      </form>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
};
