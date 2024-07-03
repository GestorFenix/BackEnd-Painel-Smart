/*
  Warnings:

  - A unique constraint covering the columns `[franchise_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "franchise_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_franchise_id_key" ON "users"("franchise_id");
