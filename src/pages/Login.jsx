import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../components/Firebase"
import { useNavigate, Link } from "react-router-dom"
import { googleSignIn, verifyEmail } from "../components/Auth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      //Authenticates the user and extracts the user object.
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

       //If the user's email is not verified...
      if (!user.emailVerified) {
        setErrorMessage("Please verify your email before logging in.")
        try {
          await verifyEmail(user)
          setErrorMessage("We've sent a new verification email. Please check your inbox.")
        } catch (verifyError) {
          console.error("Verification email error:", verifyError)
          setErrorMessage("Failed to send verification email. Please try again later.")
        }
        setIsLoading(false)
        return
      }
       // Saves user's token and info so your app knows they’re logged in.
      const token = await user.getIdToken()
      localStorage.setItem("authToken", token)

      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.uid)

      navigate("/home")
    } catch (error) {
      console.error("Login Error:", error)
      localStorage.clear()

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMessage("Invalid email or password. Please try again.")
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many failed login attempts. Please try again later or reset your password.")
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error. Please check your internet connection.")
      } else {
        setErrorMessage("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setErrorMessage("")

    try {
      const result = await googleSignIn()
      if (result?.user) {
        localStorage.setItem("authToken", await result.user.getIdToken())
        localStorage.setItem("userEmail", result.user.email)
        localStorage.setItem("userId", result.user.uid)

        navigate("/home")
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setErrorMessage("Google sign-in failed. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white-50 flex items-center justify-center p-4 bor">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <img
          src="/Logo.png"
          alt="Logo"
          className="h-16 w-26 mx-auto mb-6"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
            console.warn("Logo image failed to load")
          }}
        />

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
              required
              disabled={isLoading || isGoogleLoading}
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400 flex items-center justify-center"
        >
          {isGoogleLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connecting...
            </span>
          ) : (
            "Sign in with Google"
          )}
        </button>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            <Link to="/forgot" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p className="mt-2">
            {"Don't have an account?"}{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

