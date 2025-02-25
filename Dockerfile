# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port for Express server
EXPOSE 3001

# Start the Express application
CMD ["npm", "start"]
