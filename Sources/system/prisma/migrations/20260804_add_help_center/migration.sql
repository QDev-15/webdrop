-- CreateTable help_categories
CREATE TABLE "webdrop"."help_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable help_articles
CREATE TABLE "webdrop"."help_articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "category_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable help_tags
CREATE TABLE "webdrop"."help_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "help_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable _helpArticle_HelpTag
CREATE TABLE "webdrop"."_helpArticle_HelpTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "help_categories_slug_key" ON "webdrop"."help_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "help_articles_slug_key" ON "webdrop"."help_articles"("slug");

-- CreateIndex
CREATE INDEX "help_articles_category_id_idx" ON "webdrop"."help_articles"("category_id");

-- CreateIndex
CREATE INDEX "help_articles_slug_idx" ON "webdrop"."help_articles"("slug");

-- CreateIndex
CREATE INDEX "help_articles_status_idx" ON "webdrop"."help_articles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "help_tags_slug_key" ON "webdrop"."help_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_helpArticle_HelpTag_AB_unique" ON "webdrop"."_helpArticle_HelpTag"("A", "B");

-- CreateIndex
CREATE INDEX "_helpArticle_HelpTag_B_index" ON "webdrop"."_helpArticle_HelpTag"("B");

-- AddForeignKey
ALTER TABLE "webdrop"."help_articles" ADD CONSTRAINT "help_articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "webdrop"."help_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webdrop"."help_articles" ADD CONSTRAINT "help_articles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "webdrop"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webdrop"."_helpArticle_HelpTag" ADD CONSTRAINT "_helpArticle_HelpTag_A_fkey" FOREIGN KEY ("A") REFERENCES "webdrop"."help_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webdrop"."_helpArticle_HelpTag" ADD CONSTRAINT "_helpArticle_HelpTag_B_fkey" FOREIGN KEY ("B") REFERENCES "webdrop"."help_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
