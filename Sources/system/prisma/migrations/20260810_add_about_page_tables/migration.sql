-- CreateTable team_members
CREATE TABLE "webdrop"."team_members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable company_values
CREATE TABLE "webdrop"."company_values" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_members_sort_order_idx" ON "webdrop"."team_members"("sort_order");

-- CreateIndex
CREATE INDEX "company_values_sort_order_idx" ON "webdrop"."company_values"("sort_order");
