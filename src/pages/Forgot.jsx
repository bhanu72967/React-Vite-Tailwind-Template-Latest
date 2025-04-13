import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../components/Firebase";
import { useNavigate , Link} from "react-router-dom";

import { useState } from "react";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setEmail("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      navigate("*");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
      <div className=" max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <img src="./lock.png" alt="Logo" className="h-16 w-26 mx-auto mb-6" />
        <title>Trouble logging in?</title>
        {message && <p className="text-green-500">{message}</p>}
        <p className="taxt-sm  text-center mb-6">
          Enter your email, phone, or username and we ll send you a link to get
          back into your account.
        </p>
        <form className="space-y-4" onSubmit={handlePasswordReset}>
          <input
            type="text"
            placeholder="Email, Phone, or Username"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors"
            type="submit"
          >
            Send Login Link
          </button>
        </form>
        <Link
          to="https://help.instagram.com/374546259294234"
          className="text-blue-500"
        >
          {"Can't Reset Password "}{" "}
        </Link>
        <br />
        <span className="text-sm text-gray-500 font-bold">
          -----------------------or-----------------------
        </span>
        <div className="mt-6 text-center text-gray-600 text-sm">
          <Link to="/signup" className="text-blue-500">
            Create New Account
          </Link>
        </div>
        <div className=" rounded-lg text-center py-3 focus:ring-2 focus:ring-black-200 focus:border-black-500 outline-none transition">
          <button
            onClick={() => navigate("*")}
            className="text-blue-500 text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
