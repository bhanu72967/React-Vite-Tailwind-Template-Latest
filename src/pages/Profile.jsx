import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../components/Firebase";
import  Sidebar  from "./Sidebar";

const db = getFirestore(app);
const auth = getAuth(app);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Get user data
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // Get user's posts
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", user.uid)
        );
        const postsSnap = await getDocs(postsQuery);
        const posts = postsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);

        // Get followers
        const followersSnap = await getDocs(
          query(collection(db, "follows"), where("followingId", "==", user.uid))
        );
        setFollowers(followersSnap.docs.map((doc) => doc.data().followerId));

        // Get following
        const followingSnap = await getDocs(
          query(collection(db, "follows"), where("followerId", "==", user.uid))
        );
        setFollowing(followingSnap.docs.map((doc) => doc.data().followingId));

        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;
  if (loading) return <p className="text-center">Loading profile...</p>;

  return (
    <>
    <Sidebar />
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex items-center mb-6">
        <img
          src={userData?.profileImage ||"./public/ben.jpg"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mr-6"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {userData?.username || "bhanu prakash"}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <div className="flex gap-6 mt-2 text-sm text-gray-700">
            <span>
              <strong>{userPosts.length}</strong> posts
            </span>
            <span>
              <strong>{followers.length}</strong> followers
            </span>
            <span>
              <strong>{following.length}</strong> following
            </span>
          </div>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Posts Grid */}
      {userPosts.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven’t posted anything yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {userPosts.map((post) => (
            <div key={post.id} className="relative group">
              <img
                src={post.imageUrl}
                alt={post.caption || "Post"}
                className="w-full h-64 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-sm">
                ❤️ {post.likes?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Profile;
