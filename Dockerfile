# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Expose port 3000 for the Node.js app
EXPOSE 3000

# Start the PostgreSQL server and the Node.js app
CMD ["node", "app.js"]
