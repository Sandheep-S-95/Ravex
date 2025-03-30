// import { useAuth } from "../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login after logout
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        {user ? (
          <span className="text-lg font-semibold">
            Welcome User! {user.first_name}
          </span>
        ) : (
          <span className="text-lg font-semibold">Not Logged In</span>
        )}
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;