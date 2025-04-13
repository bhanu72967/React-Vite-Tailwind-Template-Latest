import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "../components/Firebase";
import Post from "./Post";
import Suggestions from "./Suggestions";
import Stories from "./Stories";
import CreatePost from "./CreatePost";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const db = getFirestore(app);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  //  Listen for auth changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // Load posts from followed users
  //Runs only if user is logged in.
  useEffect(() => {
    if (!user) return;

    const fetchFollowedPosts = async () => {
      try {
        const followsSnapshot = await getDocs(
          query(collection(db, "follows"), where("followerId", "==", user.uid))
        );

        const followedIds = followsSnapshot.docs.map(
          (doc) => doc.data().followingId
        );
        followedIds.push(user.uid); // include own posts
        // Skip fetching if user follows no one.
        if (followedIds.length === 0) return;
        //Fetches latest 10 posts from followed users, sorted newest first.
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "in", followedIds),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
          const fetchedPosts = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const likes = data.likes || [];
            const comments = data.comments || [];

            return {
              id: docSnap.id,
              ...data,
              likes,
              comments,
              likedByCurrentUser: likes.includes(user.uid),
            };
          });

          setPosts(fetchedPosts);
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.warn("Error loading posts:", error.message);
        setIsLoading(false);
      }
    };

    fetchFollowedPosts();
  }, [user]);

  // ❤️ Like/Unlike
  const handleLike = async (postId, liked) => {
    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  // 💬 Comment
  const handleComment = async (postId, commentText) => {
    const postRef = doc(db, "posts", postId);
    const newComment = {
      userId: user.uid,
      username: user.email, // You can use displayName if available
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="flex justify-center mt-20 ml-32 px-2">
        <div className="w-full max-w-2xl">
          <Stories />
          <CreatePost onPostCreated={() => {}} />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id, post.likedByCurrentUser)}
                onComment={(commentText) => handleComment(post.id, commentText)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No posts to show.
            </div>
          )}
        </div>

        <div className="hidden md:block ml-10 mt-4 w-80">
          <Suggestions />
        </div>
      </div>
    </>
  );
};

export default Home;
