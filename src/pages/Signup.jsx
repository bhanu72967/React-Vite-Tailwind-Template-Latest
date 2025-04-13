import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/Firebase";
import { Link, useNavigate } from "react-router-dom";
import { verifyEmail } from "../components/Auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const db = getFirestore(); // Initialize Firestore

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: email.split("@")[0], // basic username from email
        avatar: "", // default or future uploaded avatar
        createdAt: new Date().toISOString(),
      });

      // ✅ Send verification email
      await verifyEmail();
      alert("Verification email sent! Please check your inbox.");

      navigate("*");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <img src="./Logo.png" alt="Logo" className="h-16 w-26 mx-auto mb-6" />
        <p className="text-sm text-center mb-6">
          Sign up to see photos and videos from your friends.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Mobile Number or Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p className="mb-3">
            People who use our service may have uploaded your contact
            information to Instagram.
            <Link
              to="https://www.facebook.com/help/instagram/261704639352628?hl=en"
              className="text-blue-500 font-medium hover:underline"
            >
              {" "}
              Learn More
            </Link>
          </p>
          <p>
            By signing up, you agree to our{" "}
            <Link
              to="https://help.instagram.com/581066165581870/?locale=en_US&hl=en"
              className="text-blue-500 font-medium hover:underline"
            >
              Terms
            </Link>
            ,{" "}
            <Link
              to="https://privacycenter.instagram.com/policies/cookies/"
              className="text-blue-500 font-medium hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and Cookies Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
