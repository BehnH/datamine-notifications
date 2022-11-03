# syntax=docker/dockerfile:1
# Build the image
FROM node:16-alpine as builder
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Run the application
FROM node:16-alpine
WORKDIR /usr

COPY package.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./

CMD ["node", "bot.js"]