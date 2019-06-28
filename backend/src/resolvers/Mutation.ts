import { MutationResolvers } from "../generated/graphql";

export const Mutation: MutationResolvers = {
  createCommunity: async (parent, args, context) => {
    const { name, description } = args.input;
    const community = await context.photon.communities.create({
      data: {
        name,
        description: description || ""
      }
    });
    return community;
  }
};
