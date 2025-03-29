import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Switch from "../components/Switch";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/user_components/Navbar";

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
  });
  const [isBuy, setIsBuy] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const categories = ["BTC", "ETH", "USDT", "XRP"];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionId = params.get("edit");
    if (transactionId) {
      fetchTransaction(transactionId);
    }
  }, [location]);

  const fetchTransaction = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://localhost:3000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { description, amount, category, type } = response.data;
      setFormData({ description, amount: amount.toString(), category });
      setIsBuy(type === "Sell");
      setEditId(id);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setErrors({ fetch: "Failed to load transaction." });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchToggle = (checked) => {
    setIsBuy(checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const transaction = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: isBuy ? "Sell" : "Buy",
    };
    const token = localStorage.getItem("access_token");

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/transactions/${editId}`, transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Transaction updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/transactions", transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Transaction saved successfully");
      }
      navigate("/transactions");
    } catch (error) {
      console.error("Error saving/updating transaction:", error.response?.data || error.message);
      setErrors({ submit: "Failed to save transaction. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-purple-700 font-montserrat mb-6">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg text-white">
          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-montserrat">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Switch onToggle={handleSwitchToggle} />
            <span
              className={`text-lg font-montserrat ${
                isBuy ? "text-green-500" : "text-red-500"
              }`}
            >
              {isBuy ? "Sell" : "Buy"}
            </span>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="w-full bg-gray-700 text-white py-2 rounded-lg font-montserrat hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded-lg font-montserrat hover:bg-purple-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : editId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;