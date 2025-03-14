# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install next@13.1.1 react@18.2.0 react-dom@18.2.0

# Copy project files
COPY . .

# Create a basic next.config.js if it doesn't exist
RUN if [ ! -f next.config.js ]; then echo "module.exports = { reactStrictMode: true };" > next.config.js; fi

# Create a basic .env file if it doesn't exist
RUN if [ ! -f .env ]; then echo "NEXT_PUBLIC_API_URL=http://localhost:3001\nNEXT_PUBLIC_WS_URL=ws://localhost:3001" > .env; fi

# Build the application
RUN npx next build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start"] 