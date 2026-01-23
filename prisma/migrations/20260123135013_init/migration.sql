/*
  Warnings:

  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectId` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
