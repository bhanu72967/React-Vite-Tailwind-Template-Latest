import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../components/Firebase";

export const createUserProfileIfNeeded = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      username: user.displayName || user.email.split("@")[0],
      profileImage: user.photoURL || "/default-avatar.png",
      email: user.email,
    });
    console.log("✅ Firestore profile created for:", user.email);
  } else {
    console.log("ℹ️ Firestore profile already exists for:", user.email);
  }
};
