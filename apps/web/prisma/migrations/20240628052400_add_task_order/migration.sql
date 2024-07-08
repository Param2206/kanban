-- CreateTable
CREATE TABLE "TaskOrder" (
    "category" TEXT NOT NULL,
    "taskIds" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskOrder_taskIds_key" ON "TaskOrder"("taskIds");

-- CreateIndex
CREATE INDEX "project_id_2" ON "TaskOrder"("project_id");

-- AddForeignKey
ALTER TABLE "TaskOrder" ADD CONSTRAINT "TaskOrder_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
