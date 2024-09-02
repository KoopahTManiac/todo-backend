FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY src ./src
COPY tsconfig.json ./
COPY .mocharc.json ./

# Build app
RUN npm run build

# remove lock file


# Expose port
EXPOSE 3000

# Start app
CMD [ "npm", "run", "docker:start" ]