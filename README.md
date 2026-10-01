## Integrantes del grupo

- **(MR230247)** Rodrigo Alexis Mejía Rivas
- **(FC230433)** Leonardo Enrique Flores Coto
- **(FM230331)** Bryan Josué Fuentes Molina
- **(PD230540)** Andre Emanuel Preza Deras
- **(MM230272)** Joaquín Eduardo Morán Mejía

# Backend de aprendizaje

API REST para una aplicación de aprendizaje de programación. Gestiona cuentas y sesiones, cursos y progreso, rachas y recompensas; también genera quizzes personalizados mediante Gemini y los procesa a través de eventos internos.

## Tecnologías

- Node.js, TypeScript y Express
- Prisma ORM con MySQL/MariaDB
- Google Gemini para funciones de IA
- pnpm para instalar dependencias y ejecutar comandos

## Requisitos

- Node.js compatible con las dependencias del proyecto
- pnpm
- Una base de datos MySQL o MariaDB
- Una clave de API de Gemini para las funciones de IA

## Inicialización

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto y configura las variables:

   ```env
   PORT=3000
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base"
   DATABASE_HOST=localhost
   DATABASE_USER=usuario
   DATABASE_PASSWORD=contraseña
   DATABASE_NAME=nombre_base
   JWT_SECRET_KEY=una_clave_secreta
   JWT_EXPIRES_IN=15m
   GEMINI_API_KEY=tu_clave_de_gemini
   ```

   `DATABASE_URL` se utiliza para las operaciones de Prisma CLI. La aplicación conecta a la base mediante las variables `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD` y `DATABASE_NAME`. `JWT_SECRET_KEY` es obligatoria; `JWT_EXPIRES_IN` y `PORT` son opcionales y, si se omiten, usan `15m` y `3000` respectivamente.

3. Crea la base de datos indicada en las variables y aplica las migraciones existentes:

   ```bash
   pnpm exec prisma migrate deploy
   pnpm exec prisma generate
   ```

   Durante el desarrollo, para crear y aplicar migraciones después de modificar el esquema, utiliza `pnpm exec prisma migrate dev --name nombre_migracion`.

4. Inicia el servidor en modo desarrollo:

   ```bash
   pnpm dev
   ```

La API escucha en `http://localhost:3000` por defecto. El puerto puede cambiarse con `PORT`.

## Áreas principales

- Autenticación y gestión de cuentas: `/login`, `/registro`, `/user`
- Cursos y avance: `/course`
- Rachas, quizzes semanales y recompensas: `/game`
- Generación de quizzes y actualización de contexto mediante Gemini y eventos internos

## Docker y Kubernetes

Construye la imagen y aplícala en Kubernetes:

```bash
docker build -t backend:latest .
kubectl apply -f k8s/
kubectl get pods
kubectl port-forward service/backend 3000:3000
```

La API quedará disponible en `http://localhost:3000`. Antes de aplicar los manifiestos, reemplaza los valores de ejemplo en `k8s/secret.yaml`; no guardes credenciales reales en el repositorio. En Minikube, carga la imagen local con `minikube image load backend:latest` antes de aplicar los manifiestos.

El Deployment de MySQL usa `emptyDir` para mantener la configuración mínima; sus datos se pierden si el pod se recrea. Para conservar datos, cambia ese volumen por un PersistentVolumeClaim.
