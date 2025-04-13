import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore";

import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
// eslint-disable-next-line no-unused-vars
//import ProtectedRoutes from "./utiles/ProtectedRoutes";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Login />} />

      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/explore" element={<Explore />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
    </Routes>
  );
}

export default App;
