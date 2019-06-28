import { Resolvers } from "../generated/graphql";
import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Subscription
};
