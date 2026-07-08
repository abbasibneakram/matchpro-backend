-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SUGGESTED', 'INTERESTED', 'MEETING_SCHEDULED', 'REJECTED', 'MARRIED');

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "sourceProfileId" TEXT NOT NULL,
    "targetProfileId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SUGGESTED',
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_sourceProfileId_targetProfileId_key" ON "Match"("sourceProfileId", "targetProfileId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_sourceProfileId_fkey" FOREIGN KEY ("sourceProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_targetProfileId_fkey" FOREIGN KEY ("targetProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
