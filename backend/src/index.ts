import { ApolloServer, gql } from "apollo-server";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import { photon } from "./context";

const typeDefs = gql(importSchema("src/schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: { photon }
});

const port = process.env.PORT || 4000;
server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
