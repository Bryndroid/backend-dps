-- CreateTable
CREATE TABLE `recompensas_catalogo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `nombre_apodo` VARCHAR(100) NULL,
    `tipo` VARCHAR(50) NULL,
    `valor_obtenible` INTEGER NOT NULL,
    `descripcion` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recompensa_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `recompensa_id` INTEGER NOT NULL,
    `fuente` VARCHAR(125) NULL,
    `fecha_obtencion` DATETIME(0) NULL,

    INDEX `recompensa_id`(`recompensa_id`),
    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_hash` VARCHAR(255) NOT NULL,
    `previous_token` VARCHAR(255) NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(250) NOT NULL,
    `xp_totales` INTEGER NOT NULL,
    `fecha_registro` DATETIME(0) NOT NULL,
    `energia_balance` INTEGER NULL,
    `estrellas_balance` INTEGER NULL,
    `AI_pista_balance` INTEGER NULL,
    `protector_racha_balance` INTEGER NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cursos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(150) NOT NULL,
    `lenguaje_programacion` VARCHAR(150) NOT NULL,
    `firebase_ref` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `fecha_inscripcion` DATETIME(0) NOT NULL,
    `conteo_errores` INTEGER NOT NULL,
    `tipo_errores` VARCHAR(500) NOT NULL,
    `progreso_porcentaje` DECIMAL(3, 3) NULL,
    `estado` VARCHAR(100) NULL,

    INDEX `curso_id`(`curso_id`),
    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_racha` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,
    `fecha` DATETIME(0) NULL,
    `racha_valor` INTEGER NULL,

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_contexto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `porcentaje_refuerzo` DECIMAL(3, 3) NOT NULL,
    `conceptos_debiles` VARCHAR(250) NOT NULL,
    `ultimo_consejo_topic` VARCHAR(250) NULL,
    `resumen_semana_actual` VARCHAR(500) NULL,

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recompensa_usuario` ADD CONSTRAINT `recompensa_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `recompensa_usuario` ADD CONSTRAINT `recompensa_usuario_ibfk_2` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensas_catalogo`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_curso` ADD CONSTRAINT `usuario_curso_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario_curso` ADD CONSTRAINT `usuario_curso_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `historial_racha` ADD CONSTRAINT `historial_racha_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario_contexto` ADD CONSTRAINT `usuario_contexto_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
