# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# 1)  deps con caché
COPY package.json package-lock.json ./
RUN npm ci

# 2)  código
COPY . .

# 3) Prisma y build Next
RUN npx prisma generate
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# artefactos del build
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/prisma /app/prisma

EXPOSE 3000
CMD ["npm", "start"]
