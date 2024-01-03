/*
  Warnings:

  - You are about to drop the column `favorited` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `played` on the `games` table. All the data in the column will be lost.
  - Added the required column `favorite_count` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intended_keystrokes` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `play_count` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "favorited",
DROP COLUMN "played",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "favorite_count" INTEGER NOT NULL,
ADD COLUMN     "intended_keystrokes" INTEGER NOT NULL,
ADD COLUMN     "play_count" INTEGER NOT NULL;
