// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar - User:", user, "Loading:", loading);

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-full py-3 px-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">CH</span>
              </div>
              <h1 className="ml-2 text-xl font-bold text-white font-montserrat transition-colors duration-300 hover:text-blue-400">
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
    await logout(); // Clear AuthContext and localStorage
    navigate("/"); // Redirect to homepage
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-md bg-white/10 rounded-full py-3 px-6 flex items-center justify-between shadow-lg">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            {/* Logo placeholder */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CH</span>
            </div>
            <h1 className="ml-2 text-xl font-bold text-white font-montserrat transition-colors duration-300 hover:text-blue-400">
              RAVEX
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/add-transaction")}
                  className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                >
                  Add
                </button>
                <button
                  onClick={() => navigate("/transactions")}
                  className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                >
                  View Transactions
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border border-red-500/50 text-red-400 px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-red-500/10 hover:border-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-white/10 hover:border-white/50"
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

export default Navbar;