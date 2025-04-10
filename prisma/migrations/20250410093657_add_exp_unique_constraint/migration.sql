/*
  Warnings:

  - A unique constraint covering the columns `[pageId,jobTitle,company]` on the table `ExperienceComponent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExperienceComponent_pageId_jobTitle_company_key" ON "ExperienceComponent"("pageId", "jobTitle", "company");
