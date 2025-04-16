import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types"; // Import PropTypes

const categoryColors = {
  BTC: "#F7931A", // Bitcoin Orange
  ETH: "#627EEA", // Ethereum Blue
  USDT: "#26A17B", // Tether Green
  XRP: "#EC4899", // Pink
};

const TransactionTable = ({ transactions }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;

    const searchLower = searchTerm.toLowerCase();
    return transactions.filter((t) =>
      [t.created_at, t.description, t.category, t.amount.toString(), t.type]
        .some((field) => field.toString().toLowerCase().includes(searchLower))
    );
  }, [transactions, searchTerm]);

  const handleEdit = (transactionId) => {
    navigate(`/add-transaction?edit=${transactionId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      {/* Table */}
      <div className="rounded-md border border-gray-600 bg-gray-900">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  onClick={() => handleEdit(transaction._id)}
                  className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer"
                >
                  <td className="p-3">
                    {format(new Date(transaction.created_at), "PP")}
                  </td>
                  <td className="p-3">{transaction.description}</td>
                  <td className="p-3">
                    <span
                      style={{ backgroundColor: categoryColors[transaction.category] || "#6B7280" }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`p-3 text-right ${
                      transaction.type === "Sell" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "Sell" ? "-" : "+"}
                    {transaction.amount.toFixed(2)}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      transaction.type === "Sell" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add PropTypes validation
TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // Unique identifier
      created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired, // Date or string
      description: PropTypes.string.isRequired, // Transaction description
      category: PropTypes.string.isRequired, // Category (e.g., BTC, ETH)
      amount: PropTypes.number.isRequired, // Transaction amount
      type: PropTypes.oneOf(["Sell", "Buy"]).isRequired, // Transaction type
    })
  ).isRequired, // Ensure transactions prop is provided
};

export default TransactionTable;