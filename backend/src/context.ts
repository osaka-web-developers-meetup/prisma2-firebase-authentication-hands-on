import Photon from "@generated/photon";
import { verifyUserToken, User } from "./client/firebase";

export interface Context {
  photon: Photon;
  user: User;
}

export const photon = new Photon();

export const getUser = async (authorization?: string): Promise<User> => {
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    const user = await verifyUserToken(token);
    if (user) return user;
  }
  throw new Error("Not authorized.");
};
