import { ApolloServer, gql } from "apollo-server";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import { photon, getUser } from "./context";

const typeDefs = gql(importSchema("src/schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: async ({ req, connection }: any) => {
    let authorization;

    if (connection) {
      authorization = connection.context.authToken;
    } else {
      authorization = req.get("Authorization");
    }

    const user = await getUser(authorization);
    return { photon, user };
  },
  subscriptions: {
    onConnect: async (connectionParams: any, webSocket) => {
      const headers = connectionParams && connectionParams.headers;
      if (headers) {
        return {
          authToken: headers.Authorization
        };
      }
    }
  }
});

const port = process.env.PORT || 4000;
server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
