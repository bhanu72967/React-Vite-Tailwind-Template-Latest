import PropTypes from "prop-types";
import { useState } from "react";

const Post = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    onComment && onComment(commentText.trim());
    setCommentText("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-4">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.userAvatar || "/mateo.jpg"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <span className="font-semibold text-gray-800">
          {post.username || "bhanu"}
        </span>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full max-h-[500px] object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>
      )}

      {/* Like Button & Count */}
      <div className="flex items-center mb-2">
        <button
          onClick={onLike}
          className={`text-xl mr-2 ${
            post.likedByCurrentUser ? "text-red-500" : "text-gray-400"
          }`}
        >
          ❤️
        </button>
        <span className="text-sm text-gray-700">
          {post.likes?.length || 0} likes
        </span>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="text-sm text-gray-800 mb-2">
          <span className="font-semibold mr-2">{post.username}</span>
          {post.caption}
        </div>
      )}

      {/* Comments */}
      {post.comments?.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            Comments:
          </h4>
          <ul className="space-y-1 max-h-24 overflow-y-auto">
            {post.comments.slice(-3).map((comment, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                <span className="font-semibold mr-1">
                  {comment.username ?? comment.userEmail ?? "Anonymous"}:
                </span>
                {comment.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Post
        </button>
      </form>

      {/* Timestamp */}
      {post.createdAt && (
        <div className="text-xs text-gray-500 mt-2">
          {new Date(
            post.createdAt?.seconds * 1000 || Date.now()
          ).toLocaleString()}
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    userAvatar: PropTypes.string,
    username: PropTypes.string,
    imageUrl: PropTypes.string,
    caption: PropTypes.string,
    likes: PropTypes.arrayOf(PropTypes.string),
    likedByCurrentUser: PropTypes.bool,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        username: PropTypes.string,
        text: PropTypes.string,
        createdAt: PropTypes.any,
      })
    ),
    createdAt: PropTypes.shape({
      seconds: PropTypes.number,
    }),
  }).isRequired,
  onLike: PropTypes.func,
  onComment: PropTypes.func,
};

Post.defaultProps = {
  onLike: () => {},
  onComment: () => {},
};

export default Post;
