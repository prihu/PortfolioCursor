/*
  Warnings:

  - A unique constraint covering the columns `[pageId,order]` on the table `HeroComponent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HeroComponent_pageId_order_key" ON "HeroComponent"("pageId", "order");
