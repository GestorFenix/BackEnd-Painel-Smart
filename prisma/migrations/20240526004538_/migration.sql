/*
  Warnings:

  - You are about to drop the column `mac` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "mac",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isAdm" BOOLEAN DEFAULT false,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Manager";

-- CreateTable
CREATE TABLE "franhises" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "dns" TEXT,
    "background_image" TEXT,
    "logo_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "usersId" TEXT NOT NULL,

    CONSTRAINT "franhises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "franhises_dns_key" ON "franhises"("dns");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "franhises" ADD CONSTRAINT "franhises_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
