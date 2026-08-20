# Multi-stage production container for SkillTwin Monorepo
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source code and seed data
COPY server/ ./

# Copy built frontend assets to server public directory
COPY --from=client-builder /app/client/dist ./public

EXPOSE 5000
CMD ["node", "src/index.js"]
