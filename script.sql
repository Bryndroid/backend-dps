INSERT INTO recompensas (id, descripcion, nombre, nombre_apodo, tipo, valor_obtenible) VALUES
(1, 'Completar con varios fallo...', 'ONE_STAR_REWARD', '¡Por un Pelo!', 'STAR', 1),
(2, 'Completar con al menos un ...', 'DOUBLE_STAR_REWARD', '¡Bien Hecho!', 'STAR', 2),
(3, 'Completar sin errores un t...', 'THREE_STAR_REWARD', '¡Perfeccion Estelar!', 'STAR', 3),
(4, 'Pequeña recarga de energia...', 'LITTLE_BUNDLE_ENERGY', 'Refresco Energetico', 'ENERGY', 10),
(5, 'Carga considerable de ener...', 'HIGH_BUNDLE_ENERGY', 'Boost Energetico', 'ENERGY', 20),
(6, 'Pago de paquete de Energia', 'PAY_BUNDLE_ENERGY', 'Paquete Energetico', 'ENERGY', 50),
(7, 'Pago considerable dc Energ...', 'PAY_HIGH_ENERGY', 'Quasar Energetico', 'ENERGY', 100),
(8, 'Escudo protector de racha ...', 'SHIELD_STRIKE', 'Escudo de Bits', 'SHIELD', 1),
(9, 'Acceso a recursos AI', 'AI_HINT', 'Ayuda Shellestial', 'AI_HINT', 1),
(10, 'Completar un segmento de u...', 'XP_REWARD', 'Aumento de RAM', 'XP', 100),
(11, 'Reduccion bit a bit', 'LESS_ENERGY', 'Avance Bit por Bit', 'XP', -20);

INSERT INTO cursos (id, firebase_ref, lenguaje_programacion, titulo)
VALUES 
    (1, 1, 'JavaScript', 'Fundamentos de Javascript'),
    (2, 1, 'Python', 'Fundamentos de Python');