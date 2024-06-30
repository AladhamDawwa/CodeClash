# Use the official Node.js 18 image as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a minimal Node.js base image for the production environment
FROM node:18-slim AS production

# Set the working directory
WORKDIR /app

# Install a minimal amount of dependencies for serving the built application
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Install a lightweight HTTP server for serving the static files
RUN npm install -g serve

# Expose the port that Cloud Run will use to serve the application
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3000"]
