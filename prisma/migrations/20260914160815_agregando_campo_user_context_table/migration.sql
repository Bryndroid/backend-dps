/*
  Warnings:

  - Added the required column `ultimo_quiz_generado` to the `usuario_contexto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario_contexto` ADD COLUMN `ultimo_quiz_generado` VARCHAR(500) NOT NULL;
