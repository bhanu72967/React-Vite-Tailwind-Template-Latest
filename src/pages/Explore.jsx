import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/Firebase";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import Sidebar from "./Sidebar";

const Explore = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load current user safely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load users and follows after auth is ready
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);

        const followsSnap = await getDocs(collection(db, "follows"));
        const followingList = followsSnap.docs
          .map((doc) => doc.data())
          .filter((d) => d.followerId === currentUser.uid)
          .map((d) => d.followingId);

        setFollowingIds(followingList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load explore data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // ✅ Only show users you're NOT following
  const suggestedUsers = allUsers.filter(
    (user) => user.id !== currentUser?.uid && !followingIds.includes(user.id)
  );

  // ✅ Search: support @username
  const normalized = searchTerm.toLowerCase().replace("@", "");
  const filteredUsers = suggestedUsers.filter((user) =>
    user.username?.toLowerCase().includes(normalized)
  );

  if (!currentUser || loading) {
    return <p className="text-center mt-10 text-gray-500">Loading users...</p>;
  }

  return (
    <>
      {" "}
      <Sidebar />
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-center">🔍 Explore Users</h2>

        <input
          type="text"
          placeholder="Search @username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded shadow-sm"
        />

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b pb-3 mb-3"
            >
              <Link
                to={`/profile/${user.uid}`}
                className="text-blue-500 hover:underline"
              >
                <img
                  src={user.avatar || "./public/mysterious.jpg"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={user.username}
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    @{user.username}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </Link>
              <FollowButton targetUserId={user.id} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Explore;
