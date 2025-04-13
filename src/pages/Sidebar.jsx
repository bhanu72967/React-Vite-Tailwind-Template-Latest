import { Link } from "react-router-dom";

const Sidebar = ({ posts }) => {
  return (
    <div className="fixed left-0 top-0 w-30 h-screen bg-white text-black  mt-14 px-10 ">
      <ul className="space-y-4 text-gray-700 mt-4 ">
        <li className="mb-4">
          <Link to="/home" aria-label="Home" className="hover:text-gray-300">
            🏠 Home
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to={{ pathname: "/profile" }}
            state={{ posts }}
            className="hover:text-gray-300"
            aria-label="Profile"
          >
            👤 Profile
          </Link>{" "}
        </li>
        <li>
          <Link to="/explore" className="hover:text-gray-300">
            Explore Users
          </Link>
        </li>
      </ul>
    </div>
  );
};
import PropTypes from "prop-types";

Sidebar.propTypes = {
  posts: PropTypes.array,
};

export default Sidebar;
