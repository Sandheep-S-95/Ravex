import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Header() {
  const { currency, setCurrency } = CryptoState();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Header - User:", user, "Loading:", loading);

  // Force re-render when user changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
        <div className="container mx-auto px-8">
          <div className="backdrop-blur-md bg-gray-900/90 rounded-full py-3 px-8 flex items-center justify-between shadow-xl ring-1 ring-gray-800/50">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                <span className="text-gray-900 text-xs font-bold">R</span>
              </div>
              <h1 className="ml-2 text-xl font-bold text-yellow-400 font-montserrat">
                RAVEX
              </h1>
            </div>
            <div>Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await logout();
      console.log("Logout successful, user should be null now");
      // Force navigation to home page after logout
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="container mx-auto px-8">
        <div className="backdrop-blur-md bg-gray-900/80 rounded-full py-3 px-8 flex items-center justify-between shadow-xl ring-1 ring-gray-800/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-gray-900 text-xs font-bold">R</span>
            </div>
            <h1 className="ml-2 text-xl font-bold text-teal-400 font-montserrat transition-colors duration-300 hover:text-yellow-500">
              RAVEX
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border border-gray-700 text-white px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            >
              <option value="USD" className="bg-gray-800">USD</option>
              <option value="INR" className="bg-gray-800">INR</option>
            </select>
            
            {user ? (
              <>
                <button
                  onClick={() => navigate("/add-transaction")}
                  className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-white/10 hover:border-gray-500 hover:shadow-md"
                >
                  Add
                </button>
                <button
                  onClick={() => navigate("/transactions")}
                  className="bg-transparent border border-blue-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-blue-600/20 hover:border-blue-500 hover:shadow-md"
                >
                  View Transactions
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border border-red-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-red-600/20 hover:border-red-500 hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border border-purple-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-purple-600/20 hover:border-purple-500 hover:shadow-md"
              >
                Login/Signup
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;