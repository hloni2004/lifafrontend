// src/App.jsx
import React, { useState } from "react";

function App() {
  const [payment, setPayment] = useState({ amount: "", method: "" });
    const [response, setResponse] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payment),
            });

            const data = await res.json();
            setResponse(data); // make sure the state type matches the API response
        } catch (err) {
            console.error("Error submitting payment:", err);
            setResponse({ error: "Payment failed" } as any); // or adjust type of response state
        }
    };

    return (
    <div style={{ padding: "20px" }}>
      <h1>Payment API Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            name="amount"
            value={payment.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Method: </label>
          <input
            type="text"
            name="method"
            value={payment.method}
            onChange={handleChange}
            placeholder="e.g., Credit Card"
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
