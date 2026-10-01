FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.6.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN DATABASE_URL="mysql://backend:backend@mysql:3306/learning" pnpm exec prisma generate \
    && pnpm exec tsc

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && exec node dist/src/index.js"]