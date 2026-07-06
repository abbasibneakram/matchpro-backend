-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "matchmakerId" TEXT NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "gender" "Gender" NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "education" TEXT,
    "profession" TEXT,
    "city" TEXT,
    "religion" TEXT,
    "sect" TEXT,
    "caste" TEXT,
    "familyDetails" TEXT,
    "rawPastedText" TEXT,
    "prefAgeMin" INTEGER,
    "prefAgeMax" INTEGER,
    "prefEducation" TEXT,
    "prefCity" TEXT,
    "prefReligion" TEXT,
    "prefSect" TEXT,
    "prefCaste" TEXT,
    "feeAgreed" DECIMAL(65,30) DEFAULT 0,
    "amountPaid" DECIMAL(65,30) DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_matchmakerId_fkey" FOREIGN KEY ("matchmakerId") REFERENCES "Matchmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
