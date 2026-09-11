# Shopping Cart Admin & Inventory Dashboard

A modern Fullstack Shopping Cart & Product Inventory management application built with an **Express.js REST API** backend and a **React (Vite)** dashboard frontend.

This project is built for the **JSD Week 11 Fullstack Integration Assessment**, demonstrating clean end-to-end client-server communication, full CRUD operations, live reactive state updates, and real-time inventory metrics.

---

## Features

### 🖥️ Backend (`server/`)
- **RESTful API**: Complete CRUD operations across all 5 endpoints (`GET`, `POST`, `PUT`, `DELETE`).
- **Modular Routing**: Clean route separation using `express.Router()` in `routes/products.js`.
- **In-Memory Store with Validation**: Robust `Product` model handling required field checks, non-negative prices, and integer quantities.
- **Search & Sort Query Strings**: Supports `?search=<keyword>` for name filtering and `?sort=price_asc|price_desc|name_asc|name_desc`.
- **Custom Logger & Middlewares**:
  - `cors()` for cross-origin communication between client (port 5173) and server (port 3000).
  - `express.json()` for request body parsing.
  - Custom Request Logger middleware logging `[timestamp] METHOD URL`.
  - 404 Route Not Found and Centralized Error Handling middleware.
- **API Testing**: Pre-configured `server/requests.http` file for testing all routes directly with the VS Code REST Client extension.

### 🎨 Frontend (`client/`)
- **Modern SaaS Dashboard UI**: Dribbble-inspired clean aesthetic with custom typography, balanced layouts, and fluid micro-interactions.
- **Live Reactive State**: Product list, KPI summary cards, and valuation metrics update immediately on state change without any page refresh.
- **Real-Time KPI Cards**:
  - **Total Products**: Live count of active catalog items.
  - **Total Units in Stock**: Aggregate inventory quantity.
  - **Low Stock Alerts**: Automatically flags items with 1 or fewer units remaining.
  - **Inventory Valuation**: Live calculated total asset value (`Price × Quantity`).
- **Interactive Asset Chart**: Dual-axis visualization tracking valuation ($) alongside in-stock units (pcs) across the catalog.
- **Custom UI Components**:
  - Custom accessible popover dropdowns for sorting and stock filtering (`CustomDropdown.jsx`).
  - Add & Edit Product modal dialogs with client-side form validation.
  - Delete confirmation modal and toast notification feedback.
  - Live API status indicator with a quick "Refresh API" trigger.
- **Centralized Environment**: API base URL configured via `.env` (`VITE_API_URL`).

---

## Project Structure

```text
your-project/
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main Dashboard layout, metrics & CRUD actions
│   │   ├── CustomDropdown.jsx   # Custom floating popover dropdown component
│   │   ├── FlickerText.jsx      # Animated brand logo component
│   │   ├── index.css            # Responsive design system & dashboard styling
│   │   └── main.jsx             # React DOM entrypoint
│   ├── .env                     # Client environment variables (VITE_API_URL)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   │   └── Product.js           # In-memory store, validation & query logic
│   ├── routes/
│   │   └── products.js          # Modular Express CRUD routes
│   ├── .gitignore
│   ├── index.js                 # Server entrypoint, middleware chain & error handling
│   ├── package.json
│   └── requests.http            # REST Client test suite for all endpoints
├── my-understanding.md          # Technical reflection and assessment answers
├── README.md                    # Project documentation & run guide
└── .gitignore                   # Root repository gitignore
```

---

## Getting Started

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Server Setup (Port 3000)

Open a terminal and navigate to the `server/` directory:

```bash
cd server
npm install
```

Start the Express server using `node --watch` for automatic file reloads:

```bash
npm run dev
# or: node --watch index.js
```

The API server will start on: **`http://localhost:3000`**

---

### 2. Client Setup (Port 5173)

Open a **second terminal** and navigate to the `client/` directory:

```bash
cd client
npm install
```

Ensure `client/.env` contains your backend API URL:
```env
VITE_API_URL=http://localhost:3000
```

Start the Vite React development server:

```bash
npm run dev
```

The React frontend will start on: **`http://localhost:5173`**

---

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| **GET** | `/` | API welcome message & endpoints overview | `200` |
| **GET** | `/products` | Fetch all products (supports `?search=` and `?sort=`) | `200` |
| **GET** | `/products/:id` | Fetch a single product by its unique ID | `200`, `404` |
| **POST** | `/products` | Create a new product (`name`, `price`, `quantity`) | `201`, `400` |
| **PUT** | `/products/:id` | Update an existing product by ID | `200`, `400`, `404` |
| **DELETE** | `/products/:id` | Remove a product by ID | `200`, `404` |

### Query String Options (`GET /products`):
- **Search**: `GET /products?search=keyboard` (case-insensitive substring filter)
- **Sort**:
  - `?sort=price_asc` — Price: Low to High
  - `?sort=price_desc` — Price: High to Low
  - `?sort=name_asc` — Name: A to Z
  - `?sort=name_desc` — Name: Z to A

---

## Testing with REST Client

You can test every API endpoint independently of the frontend using the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension.

Open [`server/requests.http`](server/requests.http) and click **"Send Request"** above any of the 14 predefined test scenarios.

---

## Tech Stack

- **Backend**: Node.js, Express.js (v4), CORS, dotenv
- **Frontend**: React (v18), Vite, Vanilla Modern CSS
- **Tooling**: REST Client, Git
