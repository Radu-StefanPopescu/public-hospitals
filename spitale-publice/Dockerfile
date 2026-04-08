# ── Stage 1: build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY spitale-publice/package*.json ./
RUN npm ci

# Injected by the pipeline; fall back to 'dev'/'local' for manual builds
ARG VITE_APP_VERSION=dev
ARG VITE_GIT_COMMIT=local
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_GIT_COMMIT=$VITE_GIT_COMMIT

COPY hospitals.json ./public/hospitals.json
COPY spitale-publice/ ./

RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
