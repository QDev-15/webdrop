-- Add websitePrice and customPrice columns to templates table
ALTER TABLE "templates" ADD COLUMN "website_price" DECIMAL;
ALTER TABLE "templates" ADD COLUMN "custom_price" DECIMAL;
