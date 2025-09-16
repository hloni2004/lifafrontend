import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TShirt {
  name: string;
  description: string;
  color: string;
  size: string;
  quantity: number;
  design?: string; // This will store the file URL or name
}

const TShirtPage: React.FC = () => {
  const [tshirts, setTShirts] = useState<TShirt[]>([]);
  const [form, setForm] = useState<TShirt>({
    name: "",
    description: "",
    color: "",
    size: "",
    quantity: 1,
    design: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" ? Number(value) : value });
  };

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm({ ...form, design: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTShirt = () => {
    setTShirts([...tshirts, form]);
    setForm({
      name: "",
      description: "",
      color: "",
      size: "",
      quantity: 1,
      design: "",
    });
  };

  const handleContinue = () => {
    navigate("/order");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>T-Shirt</h1>

      {/* Form */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "40px",
        background: "#ecf0f1",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Description:</label><br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Color:</label><br />
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Size:</label><br />
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Quantity:</label><br />
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              min={1}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Upload Design:</label><br />
            <input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleDesignUpload} />
          </div>

          <button
            onClick={handleAddTShirt}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Add T-Shirt
          </button>
        </div>

        {/* Design Preview */}
        <div style={{ flex: 1, textAlign: "center" }}>
          {form.design ? (
            <img src={form.design} alt="Design Preview" style={{ maxWidth: "100%", borderRadius: "10px" }} />
          ) : (
            <div style={{
              width: "100%",
              height: "300px",
              background: "#bdc3c7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              color: "#7f8c8d"
            }}>
              Design Preview
            </div>
          )}
        </div>
      </div>

      {/* Table of Created T-Shirts */}
      {tshirts.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#2980b9", color: "#fff" }}>
                <th style={{ padding: "10px" }}>Name</th>
                <th>Description</th>
                <th>Color</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Design</th>
              </tr>
            </thead>
            <tbody>
              {tshirts.map((tshirt, index) => (
                <tr key={index} style={{ textAlign: "center", borderBottom: "1px solid #bdc3c7" }}>
                  <td>{tshirt.name}</td>
                  <td>{tshirt.description}</td>
                  <td>{tshirt.color}</td>
                  <td>{tshirt.size}</td>
                  <td>{tshirt.quantity}</td>
                  <td>
                    {tshirt.design && <img src={tshirt.design} alt={tshirt.name} style={{ width: "50px", borderRadius: "5px" }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Continue Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={handleContinue}
          style={{
            padding: "12px 30px",
            background: "#e67e22",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TShirtPage;