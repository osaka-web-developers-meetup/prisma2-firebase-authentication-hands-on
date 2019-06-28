import { QueryResolvers } from "../generated/graphql";

export const Query: QueryResolvers = {
  communities: async (parent, args, context) => {
    return await context.photon.communities.findMany();
  }
};
