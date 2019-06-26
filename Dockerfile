FROM node:10.16

WORKDIR /home/app

USER node

# 4000 - GraphQL Server
# 5555 - Prisma2 Studio
EXPOSE 4000 5555

ENTRYPOINT /bin/bash
