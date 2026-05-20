# Use the official Node.js 20 alpine image as base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Expose the port the server listens on
EXPOSE 3000

# Set production environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]
