// cloudinary.js

const CLOUDINARY_UPLOAD_PRESET = "instaclone_preset";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtlwknjqn/image/upload";

/**
 * Uploads an image to Cloudinary.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string|null>} - Secure URL of the uploaded image or null on failure.
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    console.error("No file provided for Cloudinary upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("No secure URL returned from Cloudinary.");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
