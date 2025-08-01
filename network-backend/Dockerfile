# DEVELOPMENT DOCKERFILE
FROM node:24-alpine AS development

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Expose the dev port
EXPOSE 3000

# PRODUCTION DOCKERFILE
FROM node:24-alpine AS production

# Set the environment variable for production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /app

# Copy only necessary files for production
COPY package*.json ./
RUN npm ci --only=production

COPY --from=development /app/ .

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

EXPOSE 3000


CMD ["npm", "run", "start:prod"]

