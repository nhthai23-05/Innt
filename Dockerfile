FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Use npm install (not npm ci) so npm resolves platform-specific native
# binaries (e.g. @rollup/rollup-linux-x64-musl) for the Alpine environment.
RUN npm install

COPY . .

RUN npm run build

# --- production stage ---
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
