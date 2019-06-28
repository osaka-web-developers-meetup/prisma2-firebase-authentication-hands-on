import { Resolvers } from "../generated/graphql";
import { Query } from "./Query";
import { Mutation } from "./Mutation";

export const resolvers: Resolvers = {
  Query,
  Mutation
};
