import { useState } from "react";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getFirestore,
  getDoc,
  doc,
} from "firebase/firestore";
import { app } from "../components/Firebase";

const db = getFirestore(app);

const CreatePost = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return alert("Please add both image and caption.");

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    setUploading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "instaclone_preset");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dtlwknjqn/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryData.secure_url) {
        throw new Error("Image upload failed.");
      }

      const imageUrl = cloudinaryData.secure_url;

      // Get user info from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Save post to Firestore
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username: userData.username || user.email,
        userAvatar: userData.avatar || "",
        imageUrl,
        caption,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });

      // Reset
      setCaption("");
      setImage(null);
      setImagePreview(null);
      onPostCreated?.();
    } catch (error) {
      console.error("Post upload failed:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h2 className="font-semibold text-lg mb-2">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-60 object-cover rounded"
            />
          </div>
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
        />

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 rounded text-white ${
            uploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

CreatePost.propTypes = {
  onPostCreated: PropTypes.func,
};

export default CreatePost;
