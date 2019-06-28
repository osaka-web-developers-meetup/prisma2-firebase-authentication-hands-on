# Migration `20190628034033-add-community`

This migration has been generated at 6/28/2019, 3:40:33 AM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20190628034033-add-community
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,16 @@
+datasource db {
+  provider = "postgres"
+  url      = "postgresql://postgres:password@db:5432/prisma_sample_development?schema=public"
+}
+
+generator photon {
+  provider = "photonjs"
+}
+
+model Community {
+  id          String    @default(cuid()) @id @unique
+  name        String    @unique
+  description String?
+  createdAt   DateTime  @default(now())
+  updatedAt   DateTime  @updatedAt
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20190628034033-add-community)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190628034033-add-community'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
