-- CreateTable
CREATE TABLE `tb_courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `duration` DOUBLE NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `isFinished` BOOLEAN NULL DEFAULT false,
    `image` VARCHAR(255) NULL,
    `level` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `courseId` INTEGER NULL,

    INDEX `courseId`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` FLOAT NOT NULL,
    `attempt` INTEGER NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `testId` INTEGER NULL,
    `userId` INTEGER NULL,

    INDEX `testId`(`testId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questions` JSON NOT NULL,
    `qntQuestions` INTEGER NOT NULL,
    `minGrade` FLOAT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `courseId` INTEGER NULL,

    INDEX `courseId`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_user_courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `watchedVideos` JSON NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `userId` INTEGER NULL,
    `courseId` INTEGER NULL,

    INDEX `courseId`(`courseId`),
    UNIQUE INDEX `tb_user_courses_courseId_userId_unique`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `image` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `duration` INTEGER NOT NULL,
    `image` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `courseId` INTEGER NULL,

    INDEX `courseId`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_products` ADD CONSTRAINT `tb_products_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `tb_courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_reports` ADD CONSTRAINT `tb_reports_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `tb_tests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_reports` ADD CONSTRAINT `tb_reports_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `tb_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_tests` ADD CONSTRAINT `tb_tests_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `tb_courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_user_courses` ADD CONSTRAINT `tb_user_courses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `tb_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_user_courses` ADD CONSTRAINT `tb_user_courses_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `tb_courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_videos` ADD CONSTRAINT `tb_videos_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `tb_courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
