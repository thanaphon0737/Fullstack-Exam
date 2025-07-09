# Base image
FROM node:24-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the application
# RUN npm run build

# Start the app
# CMD ["node", "dist/main"]
 CMD ["npm", "run", "start:dev"]