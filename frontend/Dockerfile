FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Install serve to run the built project
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the server using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
