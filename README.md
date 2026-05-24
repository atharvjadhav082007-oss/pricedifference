# PriceRadar 🔴

A full-stack Indian e-commerce price comparison platform.

## Tech Stack
- **Frontend**: React 18 + Vite, React Router v6, Axios, Chart.js
- **Backend**: Node.js + Express, Mongoose, node-cron, Nodemailer
- **Database**: MongoDB

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Set up environment variables

**Server** (`server/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/priceradar
PORT=5000
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed the database

```bash
cd server && npm run seed
```

This seeds 20 products across 5 categories with 180 days of price history per platform.

### 4. Start development servers

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
# Runs on http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (query: `category`, `search`, `sort`, `page`, `limit`) |
| GET | `/api/products/:id` | Product detail + all platform prices |
| GET | `/api/prices/:productId` | Latest price per platform |
| GET | `/api/history/:productId?range=30D` | Price history (7D/30D/60D/1Y) |
| POST | `/api/alerts` | Create price alert |
| GET | `/api/alerts/:email` | List alerts for email |
| DELETE | `/api/alerts/:id` | Delete alert |

---

## Deployment

### MongoDB Atlas
1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Copy connection URI to `server/.env` as `MONGODB_URI`

### Railway (Backend)
1. Push to GitHub
2. Create new Railway project → Deploy from GitHub (select `server/` folder)
3. Add all env vars from `server/.env`

### Vercel (Frontend)
1. Import `client/` folder to Vercel
2. Set `VITE_API_URL` to your Railway URL
3. `vercel.json` handles SPA routing

---

## Adding Real APIs

Replace mock functions in `server/utils/scraper.js`:

- **Amazon** → RapidAPI "Real-Time Amazon Data"
- **Flipkart** → RapidAPI "Real-Time Flipkart Data"
- **Croma/Reliance/Vijay** → SerpAPI Google Shopping
- **Meesho/Ajio** → Oxylabs or ScraperAPI

Add keys to `server/.env` and swap the function bodies.
