import Photon from "@generated/photon";
import { verifyUserToken, User } from "./client/firebase";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export interface Context {
  photon: Photon;
  user: User;
}

export const photon = new Photon();

export const getUser = async (ctx: ExpressContext): Promise<User> => {
  const Authorization = ctx.req.get("Authorization");

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    return await verifyUserToken(token);
  }
  throw new Error("Not authorized.");
};
