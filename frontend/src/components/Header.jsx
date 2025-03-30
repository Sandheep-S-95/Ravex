import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { currency, setCurrency } = CryptoState();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Header - User:", user, "Loading:", loading);

  if (loading) {
    return (
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="flex-1 text-xl font-bold text-yellow-400 font-montserrat">
            Crypto Hunter
          </h1>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1
          className="flex-1 text-xl font-bold text-yellow-400 font-montserrat cursor-pointer hover:text-yellow-500 transition-colors"
          onClick={() => navigate("/")}
        >
          Crypto Hunter
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-24 h-10 p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
          {user ? (
            <>
              <button
                onClick={() => navigate("/add-transaction")}
                className="bg-black text-white px-4 py-2 rounded-lg font-montserrat hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => navigate("/transactions")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-montserrat hover:bg-blue-700 transition-colors"
              >
                View Transactions
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-montserrat hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-montserrat hover:bg-purple-700 transition-colors"
            >
              Login/Signup
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;