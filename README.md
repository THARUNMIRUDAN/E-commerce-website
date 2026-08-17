# Royal Shopping

Full-stack MERN e-commerce web application with user authentication, product catalog with filtering and search, shopping cart, wishlist, order checkout, and admin dashboard.

## Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas)

### Setup

1. Clone or extract the project.
2. Install dependencies:
   ```bash
   npm run install:all
   ```

### Running the App

Run both frontend and backend concurrently from the root directory:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Or run them individually:
- `npm run server` (starts the Express API with nodemon)
- `npm run client` (starts the Vite dev server)

## Test Accounts

- **Admin**: `admin@revibe.com` / `adminpassword123`
- **User**: `tharun@revibe.com` / `userpassword123`

## Project Structure

```
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth, Cart, Wishlist, Toast state
│   │   ├── pages/       # Route pages (Home, Shop, Cart, Admin, etc.)
│   │   ├── services/    # API request handlers
│   │   └── index.css    # Global stylesheet
├── server/              # Express backend
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic controllers
│   ├── middleware/      # Auth and error middleware
│   ├── models/          # Mongoose data schemas
│   ├── routes/          # API route definitions
│   └── seeder/          # Database seeding scripts
└── package.json         # Workspace scripts
```
