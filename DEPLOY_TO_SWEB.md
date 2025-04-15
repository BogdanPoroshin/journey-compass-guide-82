
# Deployment Guide for sweb.ru Free Hosting

This guide will help you deploy your Journey Compass Guide application to sweb.ru free hosting.

## Prerequisites

- A sweb.ru free hosting account
- FTP client (like FileZilla)
- Node.js and npm installed on your local machine

## Building the Application

1. Run the build script:
   ```
   ./build.sh
   ```
   
   or manually:
   
   ```
   npm install
   npm run build
   ```

2. This will create a `dist` folder with your compiled application.

## Uploading to sweb.ru

1. Connect to your sweb.ru hosting using FTP:
   - Host: Your FTP hostname (usually ftp.yourdomain.ru or provided by sweb.ru)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (default FTP port)

2. Navigate to the public_html or httpdocs directory (or the directory specified by sweb.ru).

3. Upload all contents from your local `dist` folder to this directory.

4. Make sure to also upload the `.htaccess` file to the same directory.

## Configuring Domain (if applicable)

1. Log in to your sweb.ru control panel.
2. Navigate to the domain settings.
3. Point your domain to the directory where you uploaded your files.

## Testing the Deployment

1. Visit your website to make sure everything is working correctly.
2. Test navigation to make sure the client-side routing works properly.
3. If you have API endpoints, make sure they are correctly configured.

## Troubleshooting

- If you see a 404 error when refreshing pages, make sure the `.htaccess` file was uploaded correctly.
- If styles or scripts aren't loading, check the browser console for path errors.
- For any issues with Russian encoding, ensure the `AddDefaultCharset UTF-8` line is present in your `.htaccess` file.

## Sweb.ru Specific Notes

- Free hosting on sweb.ru has limitations, including:
  - Limited disk space
  - Limited bandwidth
  - No SSL certificate (https) for free accounts
  - Limited PHP/database functionality

If you encounter issues or need more features, consider upgrading to a paid plan.
