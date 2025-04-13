import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../components/Firebase";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center bg-white shadow-md p-4 fixed top-0 left-0 w-full z-10">
      <h1 className="text-xl font-bold text-black ">
        <Link to="*">InstaClone</Link>
      </h1>
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-1 border rounded-md"
      />
      <div className="flex gap-4">
        <button
          onClick={() => logoutUser(navigate("*"))}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
