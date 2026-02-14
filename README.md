# 3D Habit & Focus Analytics Dashboard

A full-stack productivity micro-application that allows users to log daily activities, explore historical data, and visualize weekly analytics using an interactive Three.js 3D bar chart.

This project simulates a real SaaS-style productivity dashboard with authentication, persistent storage, structured analytics, and interactive visualization.

---

## Project Overview

The 3D Habit & Focus Analytics Dashboard is designed to:

- Authenticate users securely
- Allow daily activity logging
- Provide historical data exploration
- Generate weekly aggregated analytics
- Visualize insights through animated 3D bar charts

The application emphasizes:

- Clear architectural separation
- API-driven data flow
- Structured UI hierarchy
- Data-first visualization
- Clean engineering practices

This is built as a coherent micro-product rather than isolated feature pages.

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Three.js (3D visualization)
- Axios (API communication)

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (authentication)
- bcrypt (password hashing)

---

## Setup Instructions

### 1. Repository Setup

```bash
cd habit-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside **backend**:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Ensure frontend `.env` contains:

```
VITE_API_URL=http://localhost:5000/api
```

---

## Data Model / Schema

Located in `backend/database/models/`.

### User Schema (`User.js`)

```js
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
}
```

- Email is unique
- Password stored using bcrypt hashing
- JWT generated upon login

---

### Activity Schema (`Activity.js`)

```js
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
}
```

Each activity belongs to a specific authenticated user.

---

## Analytics Logic

Analytics are calculated dynamically via backend aggregation in `backend/src/controllers/activityController.js`.

### Weekly Time Range

- System determines start and end of current week
- Filters activities within that date range
- Filters by authenticated user

---

### 1. Daily Totals

Grouped by date using MongoDB aggregation:

```js
{
  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
  total: { $sum: "$duration" }
}
```

Example result:

```json
[
  { "date": "2026-02-10", "total": 120 },
  { "date": "2026-02-11", "total": 90 }
]
```

---

### 2. Category Distribution

Grouped by category:

```js
{
  _id: "$category",
  total: { $sum: "$duration" }
}
```

Used to generate percentage-based breakdown in the UI.

---

## Three.js Visualization Logic

The analytics visualization is implemented in `frontend/src/visualization/ThreeBarChart.jsx`. It maps backend data directly to 3D geometry.

### Data → Visual Mapping

Each data item:

```js
{ day: "Mon", total: 120 }
```

Is converted into:

- One 3D bar (`BoxGeometry`)
- Height proportional to duration

---

### Height Scaling Strategy

```
normalizedHeight = (value / maxValue) * MAX_HEIGHT
```

- Maintains visual balance
- Preserves relative proportions
- Prevents extreme height distortion

---

### Animation Logic

- Bars initialize with `scale.y = 0`
- Animated upward using easing
- Staggered animation for depth
- Subtle camera motion for dimensional feel

---

### Interaction

- Raycasting for hover detection
- Hovered bars scale slightly and brighten
- Proper resource disposal on component unmount

---

## Project Structure

```
backend/
  database/
    models/       # Mongoose schemas (User, Activity)
  src/
    controllers/  # Business logic & Route handlers
    middleware/   # Auth & Error handling
    routes/       # API endpoints definitions
    lib/          # Utility functions (JWT helpers)
  index.js        # Server entry point

frontend/
  src/
    components/   # Reusable UI components
    pages/        # Main application views
    visualization/# Three.js chart implementation
    context/      # Global state (AuthContext)
    api/          # Axios instance & API services
    utils/        # UI & Date helpers
    App.jsx       # App layout & Routing
    main.jsx      # React entry point
```

---

## Assumptions & Architectural Decisions

1. Custom JWT authentication was implemented instead of OAuth to explicitly demonstrate backend security design, token validation, and protected route handling.

2. React Context API was chosen for global state management instead of Redux or Zustand. The application's state requirements are limited to authentication and user session handling, making Context a lightweight and sufficient solution.

3. Weekly analytics are calculated server-side using MongoDB aggregation pipelines to ensure separation of concerns and reduce frontend complexity.

4. Three.js was implemented manually instead of chart libraries to demonstrate low-level visualization engineering, geometry control, animation orchestration, and interactive raycasting.

5. Architecture prioritizes separation of concerns across authentication, activity management, analytics processing, and visualization layers.

---

## Engineering Focus

- Clean API-based architecture
- Secure route protection
- User-specific data isolation
- Structured backend aggregation
- Intentional UI hierarchy
- Data-driven 3D visualization
