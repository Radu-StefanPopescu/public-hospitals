# ── Stage 1: build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY spitale-publice/package*.json ./
RUN npm ci

# hospitals.json lives at repo root; make it available as a static asset
COPY hospitals.json ./public/hospitals.json

COPY spitale-publice/ ./

RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
