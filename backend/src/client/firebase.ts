import firebaseAdmin from "firebase-admin";

export interface User {
  uid: String;
  [key: string]: any;
}

const admin = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n")
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  "server"
);

export const verifyUserToken = async (token: string): Promise<User | void> => {
  const user = await admin.auth().verifyIdToken(token, true);
  if (user.uid) return user;
};
