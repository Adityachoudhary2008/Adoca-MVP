# Adoca Services - Industrial Quantum Marketplace

Adoca is a professional, mobile-first PWA designed to connect local experts and industrial suppliers directly with customers. It is built for scalability, security, and real-world reliability.

## 🚀 Key Industrial Features

- **High-Fidelity Mobile UI**: A premium, card-based interface optimized for native-like performance on all mobile devices.
- **Lead Preservation (Offline Queue)**: Built-in offline submission queuing with automatic background retry logic. No lead is ever lost due to connectivity issues.
- **Industrial Service Worker**: Hybrid caching strategy (NetworkFirst for logic, CacheFirst for assets) ensuring zero-downtime updates and robust offline support.
- **Enterprise Security**: Global XSS sanitization layer and strict input validation (Phone/Email/Currency).
- **Automated Geolocation**: Real-time locality detection using Browser Geolocation and Nominatim Reverse Geocoding.
- **Web Share Integration**: Native sharing capabilities for professional collaboration.

## 🛠️ Configuration & Customization

### 1. Backend Integration (Google Sheets)
Adoca is pre-configured to sync leads to Google Sheets. To update the backend:
- Open `js/submit-handler.js`.
- Update `GOOGLE_SCRIPT_URL` with your unique Google Apps Script production URL.
- Update `TARGET_EMAIL` for automated notifications.

### 2. Services & Products
To add or modify categories:
- Open `js/config.js`.
- Edit `SERVICE_CATEGORIES` or `PRODUCT_CATEGORIES`.
- Adoca automatically generates the UI, routing, and search entries based on this configuration.

## 🌐 Deployment Instructions

Adoca is a static-first PWA and can be deployed to any modern cloud platform:

### Netlify / Vercel
1. Connect your GitHub repository.
2. Set the build command to: (None required, Adoca is zero-dependency).
3. Set the publish directory to: `./`.

### Railway
1. Use the static hosting template.
2. Ensure `index.html` is in the root directory.

## 📈 Scaling for Production
Adoca's modular architecture (`app.js`, `utils.js`, `submit-handler.js`) is designed for enterprise growth. The stateless rendering engine allows for rapid feature expansion without increasing technical debt.

---
Developed by **Aditya Kumar Chaudhary** | *Empowering local commerce with digital capabilities.*
