FROM node:20.11.1-slim

# Instalar dependencias necesarias para sharp
RUN apt-get update && apt-get install -y \
  libvips-dev \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --shamefully-hoist && \
    pnpm build

ENV NODE_ENV=production

CMD ["pnpm", "start"]
