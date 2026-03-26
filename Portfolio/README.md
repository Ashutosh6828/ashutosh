# TVA Personnel File (Portfolio)

A retro-futuristic, TVA/Loki-inspired personal portfolio built with React and Vite. It features dynamic scanline overlays, an interactive boot sequence, and an integrated assistant module.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 16 or higher is recommended)
- npm (comes packaged with Node.js)

## How to Run the Project Local

Follow these steps to get the environment up and running on your local machine:

1. **Navigate to the project directory** (if you aren't already there):
   ```bash
   cd Portfolio
   ```

2. **Install dependencies**:
   Run the following command to install all the required packages from `package.json`:
   ```bash
   npm install
   ```

3. **Start the development server**:
   Launch the application in development mode with hot-module reloading:
   ```bash
   npm run dev
   ```

4. **View the project in your browser**:
   Once the server starts, it will provide a local URL in the terminal (usually `http://localhost:5173/` or `http://localhost:5175/`). Open that link in your browser to view the portfolio.

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`
Starts the Vite development server.

### `npm run build`
Bundles the application into static files for production. The output is placed in the `dist` folder.

### `npm run preview`
Boots up a local static web server that serves the files from your `dist` folder. This is useful for checking the production build locally before deploying.

## Configuration (Optional)

**Contact Form (EmailJS):**
If you wish to make the communication terminal fully functional instead of using the local mail client fallback:
1. Create a free account at [EmailJS](https://www.emailjs.com/).
2. Open `src/components/Contact.jsx`.
3. Locate the configuration variables at the top of the file and replace them with your credentials:
   ```javascript
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
   ```

## Easter Eggs
- Try typing **DOOM** on your keyboard (not in an input field) to activate a secret mode. Type **LOKI** to return to the Sacred Timeline.
