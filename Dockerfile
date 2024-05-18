# Use an official Node.js runtime as a parent image
FROM node:16 AS build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json
COPY Backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend source files
COPY Backend/ ./

# Copy the .env file
COPY Backend/.env ./

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend package.json and package-lock.json
COPY Frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend source files
COPY Frontend/ ./

# Build the frontend
RUN npm run build

# Create the public directory in the backend
RUN mkdir -p /app/backend/public

# Move the built frontend files to the backend's public directory
RUN cp -r /app/frontend/dist/* /app/backend/public

# Copy favicon.ico to the public directory
RUN cp /app/frontend/favicon.ico /app/backend/public

# Set the working directory back to the backend
WORKDIR /app/backend

# Expose the port the app runs on
EXPOSE 4000

# Start the backend application
CMD ["node", "app.js"]
