import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore} from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const users = [
  {
    username: "john_doe",
    profileImage: "https://i.pravatar.cc/150?img=1",
  },
  {
    username: "jane_smith",
    profileImage: "https://i.pravatar.cc/150?img=2",
  },
  {
    username: "michael_lee",
    profileImage: "https://i.pravatar.cc/150?img=3",
  },
  {
    username: "sarah_connor",
    profileImage: "https://i.pravatar.cc/150?img=4",
  },
  {
    username: "tony_stark",
    profileImage: "https://i.pravatar.cc/150?img=5",
  },
];

async function seed() {
  console.log("🌱 Seeding Firestore...");

  const userRefs = [];

  // Step 1: Add all users to Firestore
  for (const user of users) {
    const userRef = await db.collection("users").add(user);
    userRefs.push({ id: userRef.id, ...user });
    console.log(`✅ Created user: ${user.username} (${userRef.id})`);
  }

  // Step 2: Pick the first user in the list to act as the "current user"
  const currentUser = userRefs[0]; // e.g., john_doe
  console.log(`👤 Using ${currentUser.username} (${currentUser.id}) as currentUser`);

  // Step 3: Add follow relationships (currentUser follows the next 2 users)
  const toFollow = userRefs.slice(1, 3); // e.g., jane_smith and michael_lee

  for (const user of toFollow) {
    await db.collection("follows").add({
      followerId: currentUser.id,
      followingId: user.id,
    });
    console.log(`🤝 ${currentUser.username} is now following ${user.username}`);
  }

  console.log("✅ Firestore seeding complete.");
}

seed().catch(console.error);
