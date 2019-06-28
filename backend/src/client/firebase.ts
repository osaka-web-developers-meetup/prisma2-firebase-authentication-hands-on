import firebaseAdmin from "firebase-admin";

export interface User {
  uid: String;
  [key: string]: any;
}

const admin = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.GCP_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  "server"
);

export const verifyUserToken = async (token: string): Promise<User> => {
  const user = await admin.auth().verifySessionCookie(token, true);

  if (user.uid) return user;
  throw new Error("Not authorized.");
};
