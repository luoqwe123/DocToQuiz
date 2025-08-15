-- AlterTable
ALTER TABLE `jsonresults` ADD COLUMN `descript` VARCHAR(255) NULL,
    ADD COLUMN `editorId` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(100) NULL,
    ADD COLUMN `uploaderId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `privileges` INTEGER NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Jsonresults_uploaderId_idx` ON `Jsonresults`(`uploaderId`);

-- CreateIndex
CREATE INDEX `Jsonresults_editorId_idx` ON `Jsonresults`(`editorId`);

-- AddForeignKey
ALTER TABLE `Jsonresults` ADD CONSTRAINT `Jsonresults_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jsonresults` ADD CONSTRAINT `Jsonresults_editorId_fkey` FOREIGN KEY (`editorId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
