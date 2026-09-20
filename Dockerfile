# syntax=docker.io/docker/dockerfile:1

# ---- build ----
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --allow-scripts
COPY tsconfig.json ./
COPY config ./config
COPY src ./src
RUN npm run build

# ---- runtime ----
FROM node:24-slim
ENV NODE_ENV=production BASE_PORT=5000
WORKDIR /app
RUN useradd --create-home --shell /usr/sbin/nologin appuser
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --allow-scripts
COPY --from=build /app/dist ./dist
COPY images ./images
RUN chown -R appuser:appuser /app/images
USER appuser
EXPOSE 5000
CMD ["node", "dist/src/server.js"]