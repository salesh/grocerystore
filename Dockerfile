# Use the official Node.js image as the base image
FROM node:16.20.2-bullseye-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV PORT 3005

# Expose the port your NestJS application will listen on
EXPOSE ${PORT}

# Command to start your NestJS application
CMD [ "npm", "run", "start:prod" ]
