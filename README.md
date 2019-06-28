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

## Step1 Add Prisma2
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

Add phonton generator
```project.prisma
datasource db {
  provider = "postgres"
  url      = "postgresql://postgres:password@db:5432/prisma_sample_development?schema=public"
}

generator photon {
  provider = "photonjs"
  output   = "node_modules/@generated/photon"
}
```

Run Prisma Studio
```
$ npx prisma2 dev
```
