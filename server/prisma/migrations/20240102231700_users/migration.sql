/*
  Warnings:

  - A unique constraint covering the columns `[provide_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_provide_account_id_key" ON "accounts"("provide_account_id");
