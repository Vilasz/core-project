-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('YOGA', 'MEDITATION', 'PILATES', 'FITNESS', 'DANCE', 'OTHER');

-- CreateTable
CREATE TABLE "posted_times" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "modality" "Modality" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posted_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_requests" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "modality" "Modality" NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "preferredTime" TEXT,
    "duration" INTEGER NOT NULL,
    "maxPrice" DOUBLE PRECISION,
    "description" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posted_times" ADD CONSTRAINT "posted_times_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_requests" ADD CONSTRAINT "class_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
