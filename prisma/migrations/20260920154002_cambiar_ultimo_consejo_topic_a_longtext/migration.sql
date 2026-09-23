-- AlterTable
ALTER TABLE `usuario_contexto` MODIFY `ultimo_consejo_topic` MEDIUMTEXT NULL,
    MODIFY `resumen_semana_actual` MEDIUMTEXT NULL,
    MODIFY `ultimo_quiz_generado` MEDIUMTEXT NOT NULL;
