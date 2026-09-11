# Shopping Cart Fullstack Application

Fullstack REST API and React frontend application for managing products.

## Project Structure

```text
your-project/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── index.js
│   ├── routes/
│   │   └── products.js
│   ├── models/
│   │   └── Product.js
│   └── package.json
├── my-understanding.md
└── README.md
```

---

## Getting Started

### 1. Server Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Start the Express server with file watching:

```bash
node --watch index.js
# or
npm run dev
```

The server runs on: `http://localhost:3000`

### 2. Client Setup

In a separate terminal, navigate to the client directory:

```bash
cd client
npm install
```

Start the React development server:

```bash
npm run dev
```

The client runs on: `http://localhost:5173`

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/products` | Return all products |
| GET | `/products/:id` | Return a single product by ID |
| POST | `/products` | Add a new product |
| PUT / PATCH | `/products/:id` | Update an existing product |
| DELETE | `/products/:id` | Remove a product |
