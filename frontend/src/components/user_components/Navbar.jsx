import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 z-10">
      <div>
        {user ? (
          <span className="text-lg font-semibold">
            Welcome User! {user.first_name}
          </span>
        ) : (
          <span className="text-lg font-semibold">Not Logged In</span>
        )}
      </div>
      <div className="flex gap-4">
        {user && location.pathname === "/transactions" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-montserrat transition-colors"
          >
            Dashboard
          </button>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-montserrat transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;