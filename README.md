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
