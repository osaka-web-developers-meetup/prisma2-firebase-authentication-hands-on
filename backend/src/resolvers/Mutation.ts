import { pubsub } from "../subscription";
import { MutationResolvers } from "../generated/graphql";
import { COMMUNITY_ADDED } from "../constant/channels";

export const Mutation: MutationResolvers = {
  createCommunity: async (parent, args, context) => {
    const { name, description } = args.input;
    const community = await context.photon.communities.create({
      data: {
        name,
        description: description || ""
      }
    });
    const communities = await context.photon.communities.findMany();
    pubsub.publish(COMMUNITY_ADDED, { communityAdded: communities });
    return community;
  }
};
