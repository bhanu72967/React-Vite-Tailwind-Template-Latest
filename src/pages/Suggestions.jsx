import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../components/Firebase";
import FollowButton from "./FollowButton";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentUser) return;

      try {
        // 1. Get all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Get following list
        const followsSnapshot = await getDocs(
          query(
            collection(db, "follows"),
            where("followerId", "==", currentUser.uid)
          )
        );
        const followingIds = followsSnapshot.docs.map(
          (doc) => doc.data().followingId
        );

        // 3. Filter users: not me + not already followed
        const suggested = users.filter(
          (user) =>
            user.id !== currentUser.uid && !followingIds.includes(user.id)
        );

        setSuggestions(suggested);
        setLoading(false);
      } catch (error) {
        console.error("Error loading suggestions:", error.message);
      }
    };

    fetchSuggestions();
  }, [currentUser]);

  if (!currentUser || loading) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Suggestions for you
      </h3>
      {suggestions.length === 0 ? (
        <p className="text-gray-400 text-sm">You re all caught up!</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || "./public/profile.jpg"}
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <FollowButton targetUserId={user.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Suggestions;
