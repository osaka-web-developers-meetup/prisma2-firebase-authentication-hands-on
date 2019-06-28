# Prisma2 + Firebase Authentication Hands-on

## Requirements
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Get started
Clone the repository:

```
$ git clone https://github.com/shinosakarb/prisma2-firebase-authentication-hands-on.git
$ cd prisma2-firebase-authentication-hands-on
```

Compose up:

```
$ ./bin/compose-up
```

Run node-dev container:

```
$ ./bin/compose-run
```

## Step1 Prisma2
Make backend directory:
```
$ mkdir backend
$ cd backend
```

NPM Initialization:
```
$ npm init -y
```

Install Prisma2:
```
$ npm install --save-dev prisma2
```

Prisma2 initialization:
```
$ npx prisma2 init .
```

Add phonton generator:

prisma/project.prisma
```diff
datasource db {
  provider = "postgres"
  url      = "postgresql://postgres:password@db:5432/prisma_sample_development?schema=public"
}

+generator photonjs {
+  provider = 'photonjs'
+}

-model Migration {
-  revision          Int       @id
-  applied           Int
-  databaseMigration String    @map("database_migration")
-  datamodel         String
-  datamodelSteps    String    @map("datamodel_steps")
-  errors            String
-  finishedAt        DateTime? @map("finished_at")
-  name              String
-  rolledBack        Int       @map("rolled_back")
-  startedAt         DateTime  @map("started_at")
-  status            String
-
-  @@map("_Migration")
-}
```

Start the Prisma development mode:
```
$ npx prisma2 dev
```

Add Community model:

prisma/project.prisma
```diff
datasource db {
  provider = "postgres"
  url      = "postgresql://postgres:password@db:5432/prisma_sample_development?schema=public"
}

generator photon {
  provider = "photonjs"
}

+model Community {
+  id          String    @default(cuid()) @id @unique
+  name        String    @unique
+  description String?
+  createdAt   DateTime  @default(now())
+  updatedAt   DateTime  @updatedAt
+}
```

Create migration file:
```
$ npx prisma2 lift save --name 'add community'
```

Run migrate:
```
$ npx prisma2 lift up
```

Run generators:
```
$ npx prisma2 generate
```

## Step2 GraphQL Server
Install TypeScript:
```
$ npm install --save-dev typescript
```

Initialize TypeScript:
```
$ npx tsc --init
```

tsconfig.yml:
```yml
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["esnext","dom"],
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "exclude": [
    "node_modules",
    "prisma"
  ]
}
```

Install Apollo Server:
```
$ npm install --save graphql apollo-server
```

Install Types:
```
$ npm install --save-dev @types/node @types/graphql
```

Install packages for Dev:
```
$ npm install --save-dev ts-node-dev dotenv @graphql-codegen/cli
```

Initialize GraphQL Code Generator:
```
$ npx graphql-codegen init
$ npm install
```

Create schema.graphql:
```
$ mkdir src && touch src/schema.graphql
```

src/schema.graphql:
```graphql
scalar DateTime

type Query {
  communities: [Community!]!
}

type Community {
  id: ID!
  name: String!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

Generate resolver types:
```
$ npm run generate
```

Create Context:
```
$ touch src/context.ts
```

src/context.ts:
```ts
import Photon from "@generated/photon";

export interface Context {
  photon: Photon;
}

export const photon = new Photon()
```

Create Resolvers:
```
$ mkdir src/resolvers
$ touch src/resolvers/index.ts src/resolvers/Query.ts
```

src/resolvers/Query.ts:
```ts
import { QueryResolvers } from "../generated/graphql";
import { Context } from "../context";

export const Query: QueryResolvers = {
  communities: async (parent, args, ctx: Context) => {
    return ctx.photon.communities.findMany();
  }
};
```

src/resolvers/index.ts:
```ts
import { Resolvers } from "../generated/graphql";
import { Query } from "./Query";

export const resolvers: Resolvers = {
  Query
};
```

Create GraphQL Server:
```
$ touch src/index.ts
```

Install graphql-import:
```
$ npm install --save graphql-import
```

src/index.ts:
```ts
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
```

Add GraphQL Server start script:

package.json
```diff
{
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
-    "generate": "graphql-codegen --config codegen.yml"
+    "generate": "graphql-codegen --config codegen.yml",
+    "start": "ts-node-dev -r dotenv/config src/index.ts"
  },
  ...
}
```

Add Mutation:
```
$ touch src/resolvers/Mutation.ts
```

Modify src/schema.graphql
```diff
scalar DateTime

type Query {
  communities: [Community!]!
}

+type Mutation {
+  createCommunity(input: CreateCommunityInput!): Community!
+}

type Community {
  id: ID!
  name: String!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

+input CreateCommunityInput {
+  name: String!
+  description: String
+}
```

Run graphql generate:
```
$ npm run generate
```

Modify src/resolvers/Mutation.ts:
```ts
import { MutationResolvers } from "../generated/graphql";
import { Context } from "../context";

export const Mutation: MutationResolvers = {
  createCommunity: async (parent, args, ctx: Context) => {
    const { name, description } = args.input;
    const community = await ctx.photon.communities.create({
      data: {
        name,
        description: description || ""
      }
    });
    return community;
  }
};
```

Modify src/resolvers/index.ts:
```diff
import { Resolvers } from "../generated/graphql";
import { Query } from "./Query";
+import { Mutation } from "./Mutation";

export const resolvers: Resolvers = {
-  Query
+  Query,
+  Mutation
};
```

Add Subscriptions:

Install package:
```
$ npm install --save graphql-subscriptions
```

Create src/subscription.ts:
```
$ touch src/subscription.ts
```

Modify src/subscription.ts:
```ts
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
```

Modify GraphQL Schema:
```diff
scalar DateTime

type Query {
  communities: [Community!]!
}

type Mutation {
  createCommunity(input: CreateCommunityInput!): Community!
}

+type Subscription {
+  communityAdded: [Community!]!
+}

type Community {
  id: ID!
  name: String!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateCommunityInput {
  name: String!
  description: String
}
```

Run graphql generate:
```
$ npm run generate
```

Create Subscription resolver:
```
$ touch src/resolvers/Subscription.ts
```

Create constant for Subscriptions:
```
$ touch src/constant/channels.ts
```

Modify src/constant/channels.ts:
```ts
export const COMMUNITY_ADDED = "COMMUNITY_ADDED";
```

Modify src/resolvers/Subscription.ts:
```ts
import { pubsub } from "../subscription";
import { SubscriptionResolvers } from "../generated/graphql";
import { COMMUNITY_ADDED } from "../constant/channels";

export const Subscription: SubscriptionResolvers = {
  communityAdded: {
    subscribe: () => pubsub.asyncIterator(COMMUNITY_ADDED)
  }
};
```

Modify src/resolvers/index.ts:
```diff
import { Resolvers } from "../generated/graphql";
import { Query } from "./Query";
import { Mutation } from "./Mutation";
+import { Subscription } from "./Subscription";

export const resolvers: Resolvers = {
  Query,
-  Mutation
+  Mutation,
+  Subscription
};
```

Modify src/resolvers/Mutation.ts:
```diff
+import { pubsub } from "../subscription";
import { MutationResolvers } from "../generated/graphql";
+import { COMMUNITY_ADDED } from "../constant/channels";

export const Mutation: MutationResolvers = {
  createCommunity: async (parent, args, context) => {
    const { name, description } = args.input;
    const community = await context.photon.communities.create({
      data: {
        name,
        description: description || ""
      }
    });
+    const communities = await context.photon.communities.findMany();
+    pubsub.publish(COMMUNITY_ADDED, { communityAdded: communities });
    return community;
  }
};
```

## Step3 Firebase Authentication

Install firebase-admin:
```
$ npm install --save firebase-admin
```

Create firebase:
```
$ mkdir src/client && touch src/client/firebase.ts
```

Modify src/client/firebase.ts:
```ts
import firebaseAdmin from "firebase-admin";

export interface User {
  uid: String;
  [key: string]: any;
}

const admin = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n")
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  },
  "server"
);

export const verifyUserToken = async (token: string): Promise<User> => {
  const user = await admin.auth().verifySessionCookie(token, true);

  if (user.uid) return user;
  throw new Error("Not authorized.");
};
```

Create .env file:
```
PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_DATABASE_URL=xxx
```

Modify src/context.ts:
```diff
import Photon from "@generated/photon";
+import { verifyUserToken, User } from "./client/firebase";
+import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export interface Context {
  photon: Photon;
+  user: User;
}

export const photon = new Photon();

+export const getUser = async (ctx: ExpressContext): Promise<User> => {
+  const Authorization = ctx.req.get("Authorization");
+
+  if (Authorization) {
+    const token = Authorization.replace("Bearer ", "");
+    return await verifyUserToken(token);
+  }
+  throw new Error("Not authorized.");
+};
```

Modify src/index.ts:
```diff
import { ApolloServer, gql } from "apollo-server";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
+import { photon, getUser } from "./context";

const typeDefs = gql(importSchema("src/schema.graphql"));

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
-  context: { photon }
+  context: async req => {
+    const user = await getUser(req);
+    return { photon, user };
+  }
});

const port = process.env.PORT || 4000;
server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
```
