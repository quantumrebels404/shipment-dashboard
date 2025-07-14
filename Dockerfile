# Step 1: Build the Angular app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire Angular project
COPY . .

# Build the Angular app (production)
RUN npm run build --prod

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the Angular build output to Nginx's html folder
COPY --from=build /app/dist/shipment-dashboard /usr/share/nginx/html

# Optional: Use a custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when container launches
CMD ["nginx", "-g", "daemon off;"]
