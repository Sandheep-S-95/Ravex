import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Navbar - User state changed:", user);
  }, [user]);

  const handleLogout = async () => {
    console.log("Logout button clicked from Navbar");
    try {
      await logout();
      console.log("Logout successful, user should be null now");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
        <div className="container mx-auto px-8">
          <div className="backdrop-blur-md bg-gray-900/80 rounded-full py-3 px-8 flex items-center justify-between shadow-xl ring-1 ring-gray-800/50">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center shadow-md">
                <span className="text-gray-900 text-xs font-bold">R</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-white">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="container mx-auto px-8">
        <div className="backdrop-blur-md bg-gray-900/80 rounded-full py-3 px-8 flex items-center justify-between shadow-xl ring-1 ring-gray-800/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-gray-900 text-xs font-bold">R</span>
            </div>
            {user ? (
              <span className="ml-2 text-xl font-semibold text-teal-400">
                Welcome, {user.first_name}
              </span>
            ) : (
              <span className="ml-2 text-xl font-semibold text-teal-400">
                Not Logged In
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {user && location.pathname === "/transactions" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-transparent border border-indigo-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-indigo-600/20 hover:border-indigo-500 hover:shadow-md"
              >
                Dashboard
              </button>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-red-700 text-white px-4 py-2 rounded-full font-montserrat transition-all duration-300 hover:bg-red-600/20 hover:border-red-500 hover:shadow-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
