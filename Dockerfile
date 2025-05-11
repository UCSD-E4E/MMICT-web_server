# -------- Development Stage -------- 

# Node.js 16 image based on Alpine Linux
FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package*.json .

# Install Python3, make and g++
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install

COPY . .

# Build the application
RUN npm run build

# -------- Production Stage -------- 

#FROM --platform=linux/amd64 node:16-alpine as production
FROM node:16-alpine as production

# Set build time variable, set to our node 16 apline image
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

# Installs only production dependancies
RUN npm ci --only=production

# Copies the compiled output (dist directory) from the development stage to the production stage's working directory.
COPY --from=development /usr/src/app/dist ./dist

# Copy certs/ca-cert.pem into dist/certs/ folder
RUN mkdir -p ./dist/certs
COPY certs/ca-cert.pem ./dist/certs/ca-cert.pem

# Our entrypoint, executes index.js inside /dist
CMD ["node", "dist/index.js"]
