
#!/bin/bash
# Build script for sweb.ru hosting

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

echo "Build completed! Upload the contents of the 'dist' folder to your sweb.ru hosting."
echo "Make sure to upload the .htaccess file as well."
