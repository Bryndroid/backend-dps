-- AlterTable
ALTER TABLE `historial_racha` ADD COLUMN `activa` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `historial_racha_usuario_id_activa_idx` ON `historial_racha`(`usuario_id`, `activa`);
