# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build Angular application for production
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy built application to nginx
COPY --from=build /app/public/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp

# Expose ports
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
