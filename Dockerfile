FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Build frontend
RUN cd client && npm run build

# Copy built frontend to server's public folder
RUN cp -r client/dist server/public

# Set working directory to server
WORKDIR /app/server

# Expose port (Cloud Run uses 8080 by default)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
