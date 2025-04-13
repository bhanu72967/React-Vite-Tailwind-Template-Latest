import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../components/Firebase";
import PropTypes from "prop-types";

const FollowButton = ({ targetUserId }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const followDocId = `${currentUser.uid}_${targetUserId}`;
  const followDocRef = doc(db, "follows", followDocId);

  useEffect(() => {
    const checkFollow = async () => {
      const docSnap = await getDoc(followDocRef);
      setIsFollowing(docSnap.exists());
      setLoading(false);
    };

    if (currentUser?.uid !== targetUserId) {
      checkFollow();
    }
  }, [targetUserId]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await deleteDoc(followDocRef);
        setIsFollowing(false);
      } else {
        await setDoc(followDocRef, {
          followerId: currentUser.uid,
          followingId: targetUserId,
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow error:", error.message);
    }
  };

  if (currentUser.uid === targetUserId) return null;
  if (loading) return <span className="text-sm text-gray-400">Loading...</span>;

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-1 rounded text-sm font-medium ${
        isFollowing ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};
FollowButton.propTypes = {
  targetUserId: PropTypes.string.isRequired,
};

export default FollowButton;
