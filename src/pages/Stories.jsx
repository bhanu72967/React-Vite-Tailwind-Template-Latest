import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../components/Firebase";
import { Link } from "react-router-dom";

const db = getFirestore(app);

const Stories = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Stories</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {users.length === 0 ? (
          <p className="text-xs text-gray-500">No stories available</p>
        ) : (
          users.map((user) => (
            <Link
              to={`/profile/${user.id}`}
              key={user.id}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full border-2 border-pink-500 overflow-hidden">
                <img
                  src={user.profileImage || "./public/ben.jpg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs mt-1 text-center truncate w-14">
                {user.username}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Stories;
