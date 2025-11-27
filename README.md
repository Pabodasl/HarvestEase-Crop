## HarvestEase – Smart Harvest Management for Paddy Farmers

HarvestEase is a MERN + Tailwind powered platform that helps paddy farmers plan, track, and optimize every stage of the harvest cycle. By combining real-time crop tracking, stock management, cost and profit analytics, and smart plant care guidance, the system reduces waste, boosts yields, and keeps every stakeholder informed.

### Platform Highlights
- **Crop Tracking (your module):** Capture farmer profile, paddy type, planted/harvest dates, land size, contact info; auto-calculate fertilization/harvest reminders; surface crop analytics per farmer; export/share via PDF; admin overview with global analytics.
- **Harvest Stock Management:** Monitor stock by paddy variety, handle per-warehouse quantities, visualize stock analytics, and manage farmer/buyer cart flows.
- **Cost Tracking & Financial Management:** Log expenses, sales, and profits, provide dashboards for farmers and admins, and forecast profitability trends.
- **Smart Plant Care:** Record pest/disease issues, suggest treatments, provide knowledge hub articles, and generate tailored care PDFs.

### Tech Stack
- **Frontend:** React 18 + Vite, Tailwind CSS, Ant Design, Chart.js, Recharts, React Router, React-PDF, jsPDF, React Toastify.
- **Backend:** Node.js + Express, MongoDB + Mongoose, JWT auth, Multer for uploads, Twilio for alerts.
- **Tooling:** ESLint, PostCSS, @vitejs/plugin-react, nodemon.

### Monorepo Structure
```
HarvestEase_new-main/
├─ Backend/              # Express API, controllers, models, routes
└─ frontend/             # React + Vite client
```

### Key Directories
- `Backend/controllers/` – feature-specific controllers (crop, stock, expenses, disease, etc.).
- `Backend/models/` – Mongo schemas such as `cropModel.js`, `stockModel.js`, `farmerModel.js`, `expensesModel.js`.
- `Backend/routes/` – REST endpoints (`cropRoute.js`, `stockRoutes.js`, `reportRoutes.js`, ...).
- `frontend/src/Pages/` – main views: `CropForm.jsx`, `CropTrackingDetail.jsx`, `AdminCrops.jsx`, `HarvestStockDetail.jsx`, `CostTrackingDetail.jsx`, `SmartPlantCareDetail.jsx`.
- `frontend/src/Components/` – shared UI pieces (headers, footers, private routes, PDF generators).

### Crop Tracking Module (Farmer Experience)
1. **Data Capture:** `CropForm.jsx` posts farmer name, paddy type, planted date, land area, phone number into MongoDB via `cropRoute`.
2. **Automation:** Backend logic in `cropController.js` calculates estimated fertilization and harvest dates based on the selected paddy variety’s growth cycle.
3. **Per-Farmer Views:** `CropTable.jsx` and `CropTrackingDetail.jsx` filter and chart the farmer’s records (growth timeline, land utilization, status badges, reminders).
4. **Analytics & Search:** Farmers can search records, filter by paddy variety or status, and download their history as PDF via `@react-pdf/renderer` and `jspdf`.
5. **Admin Oversight:** `AdminCrops.jsx` and `AdminDashboard.jsx` aggregate all farmer records, highlight risky crops, and surface cross-farm KPIs (area harvested, expected yield, fertilizer schedule density).

### Additional Modules
- **Harvest Stock:** `StockForm.jsx`, `StockTable.jsx`, `StockAnalysisChart.jsx`, plus buyer flows (`ShopPage.jsx`, `CartPage.jsx`). Admins monitor per-variety stock levels and price trends; farmers get alerts when stock drops below thresholds.
- **Cost & Finance:** `CostTrackingDetail.jsx`, `FinancialDashboard.jsx`, `AdminFinancialDashboard.jsx` pull data from `expensesModel.js`, `salesModel.js`, `profitsRoutes.js` to show cost breakdowns, margin analysis, and cashflow projections.
- **Smart Plant Care:** `DiseaseUser.jsx`, `DiseaseView.jsx`, `SmartPlantCareDetail.jsx` integrate disease diagnostics, treatment recommendations, and PDF reports (`DiseasePDF.jsx`). Admins manage the knowledge hub via `postRoutes.js`.

### Getting Started
1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd HarvestEase_new-main

   # Backend
   cd Backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Environment Variables**
   Create `Backend/.env` with:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<secure-random-string>
   TWILIO_ACCOUNT_SID=<optional>
   TWILIO_AUTH_TOKEN=<optional>
   ```
   (Add any other service keys you need, such as email providers.)

3. **Run the Servers**
   ```bash
   # Backend (http://localhost:5000 by default)
   cd Backend
   npm start

   # Frontend (http://localhost:5173)
   cd ../frontend
   npm run dev
   ```

4. **Login & Roles**
   - Seed initial users via `Backend/utils/seedUsers.js` or manually register through the UI.
   - Farmers, buyers, and admins see role-based dashboards (`AuthContext.jsx` + `PrivateRoute.jsx` guard views).

### API Overview
- `POST /api/crops` – create new crop tracking entry (farmer-facing).
- `GET /api/crops/:farmerId` – list farmer crops with computed analytics.
- `GET /api/admin/crops` – admin aggregation and KPIs.
- `POST /api/stocks`, `GET /api/stocks` – manage harvest stock.
- `POST /api/expenses`, `POST /api/sales`, `GET /api/profits` – financial tracking.
- `POST /api/diseases` – log plant diseases, respond with treatment suggestions.

*(See `Backend/routes/*.js` for the full list of endpoints.)*

### Testing & Quality
- Frontend linting: `cd frontend && npm run lint`
- Backend nodemon for live reload: `cd Backend && npm start`
- PDF exports rely on browser APIs—test in Chromium-based browsers for best results.

### Roadmap Ideas
- Real-time push alerts for fertilization/harvest reminders using Twilio/WhatsApp.
- Offline-first mobile client for field data entry.
- AI-powered disease detection from uploaded images.

---
Built with ❤️ to empower paddy farmers through data-driven decisions and sustainable practices.
