import { pubsub } from "../subscription";
import { SubscriptionResolvers } from "../generated/graphql";
import { COMMUNITY_ADDED } from "../constant/channels";

export const Subscription: SubscriptionResolvers = {
  communityAdded: {
    subscribe: () => pubsub.asyncIterator(COMMUNITY_ADDED)
  }
};
