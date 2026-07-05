FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server (for easy local running by recruiters)
CMD ["npm", "run", "dev"]
