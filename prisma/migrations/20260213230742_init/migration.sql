-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUBMITTER', 'REVIEWER', 'DIRECTOR');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'EVALUATING', 'EVALUATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecommendationTier" AS ENUM ('HIGH_MATCH', 'PARTIAL_MATCH', 'NON_RESPONSIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SUBMITTER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "capability_text" TEXT NOT NULL,
    "technical_vitals" JSONB NOT NULL,
    "digitalfoundry_tags" TEXT[],
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "uci_total" DOUBLE PRECISION NOT NULL,
    "strategic_alignment" DOUBLE PRECISION NOT NULL,
    "technical_maturity" DOUBLE PRECISION NOT NULL,
    "digitalfoundry_viability" DOUBLE PRECISION NOT NULL,
    "reasoning_trace" JSONB NOT NULL,
    "recommendation" "RecommendationTier" NOT NULL,
    "digitalfoundry_match" JSONB,
    "citations" JSONB NOT NULL DEFAULT '[]',
    "summary_blurb" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "host_platforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "available_slots" JSONB NOT NULL,
    "deployment_window" JSONB NOT NULL,
    "exercise_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "host_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_submission_id_key" ON "evaluations"("submission_id");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
