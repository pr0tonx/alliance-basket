# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json /usr/src/app


# Install dependencies
RUN npm install


# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "run", "dev"]
