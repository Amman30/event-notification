# ---- Base build image ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Install pnpm
    RUN npm install -g pnpm
    
    # Copy package files
    COPY package.json pnpm-lock.yaml* ./
    
    # Install deps
    RUN pnpm install --frozen-lockfile
    
    # Copy source
    COPY . .
    
    # Build app
    RUN pnpm run build
    
    # ---- Production runtime ----
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    RUN npm install -g pnpm
    
    # Copy only necessary files
    COPY package.json pnpm-lock.yaml* ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    
    # Set env
    ENV NODE_ENV=production
    EXPOSE 3000
    
    # Run app
    CMD ["node", "dist/main.js"]
    