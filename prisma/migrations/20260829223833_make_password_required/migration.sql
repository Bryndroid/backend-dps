/*
  Warnings:

  - Made the column `titulo` on table `cursos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lenguaje_programacion` on table `cursos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firebase_ref` on table `cursos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `recompensa_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recompensa_id` on table `recompensa_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valor_obtenible` on table `recompensas_catalogo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `usuario_contexto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `porcentaje_refuerzo` on table `usuario_contexto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conceptos_debiles` on table `usuario_contexto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `usuario_curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `curso_id` on table `usuario_curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_inscripcion` on table `usuario_curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conteo_errores` on table `usuario_curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipo_errores` on table `usuario_curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hash` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `xp_totales` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_registro` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `recompensa_usuario` DROP FOREIGN KEY `recompensa_usuario_ibfk_1`;

-- DropForeignKey
ALTER TABLE `recompensa_usuario` DROP FOREIGN KEY `recompensa_usuario_ibfk_2`;

-- DropForeignKey
ALTER TABLE `usuario_contexto` DROP FOREIGN KEY `usuario_contexto_ibfk_1`;

-- DropForeignKey
ALTER TABLE `usuario_curso` DROP FOREIGN KEY `usuario_curso_ibfk_1`;

-- DropForeignKey
ALTER TABLE `usuario_curso` DROP FOREIGN KEY `usuario_curso_ibfk_2`;

-- AlterTable
ALTER TABLE `cursos` MODIFY `titulo` VARCHAR(150) NOT NULL,
    MODIFY `lenguaje_programacion` VARCHAR(150) NOT NULL,
    MODIFY `firebase_ref` TINYINT NOT NULL;

-- AlterTable
ALTER TABLE `recompensa_usuario` MODIFY `usuario_id` INTEGER NOT NULL,
    MODIFY `recompensa_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `recompensas_catalogo` MODIFY `valor_obtenible` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuario_contexto` MODIFY `usuario_id` INTEGER NOT NULL,
    MODIFY `porcentaje_refuerzo` DECIMAL(3, 3) NOT NULL,
    MODIFY `conceptos_debiles` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `usuario_curso` MODIFY `usuario_id` INTEGER NOT NULL,
    MODIFY `curso_id` INTEGER NOT NULL,
    MODIFY `fecha_inscripcion` DATETIME(0) NOT NULL,
    MODIFY `conteo_errores` INTEGER NOT NULL,
    MODIFY `tipo_errores` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `nombre` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password_hash` VARCHAR(250) NOT NULL,
    MODIFY `xp_totales` INTEGER NOT NULL,
    MODIFY `fecha_registro` DATETIME(0) NOT NULL;

-- AddForeignKey
ALTER TABLE `recompensa_usuario` ADD CONSTRAINT `recompensa_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recompensa_usuario` ADD CONSTRAINT `recompensa_usuario_ibfk_2` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensas_catalogo`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario_curso` ADD CONSTRAINT `usuario_curso_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario_curso` ADD CONSTRAINT `usuario_curso_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario_contexto` ADD CONSTRAINT `usuario_contexto_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
