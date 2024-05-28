/*
  Warnings:

  - You are about to drop the column `usersId` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the `franhises` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientsId` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_usersId_fkey";

-- DropForeignKey
ALTER TABLE "franhises" DROP CONSTRAINT "franhises_usersId_fkey";

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "usersId",
ADD COLUMN     "clientsId" TEXT NOT NULL;

-- DropTable
DROP TABLE "franhises";

-- CreateTable
CREATE TABLE "franchises" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "dns" TEXT,
    "client_limit" INTEGER,
    "background_image" TEXT,
    "logo_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "usersId" TEXT NOT NULL,

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "mac" TEXT,
    "name" TEXT,
    "description" TEXT,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "franchises_dns_key" ON "franchises"("dns");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_mac_key" ON "Clients"("mac");

-- AddForeignKey
ALTER TABLE "franchises" ADD CONSTRAINT "franchises_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
