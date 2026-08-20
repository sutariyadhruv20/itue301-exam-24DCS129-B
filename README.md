# MedCare Plus - Hospital Appointment System

A full-stack modern web application for managing doctors, patient records, and appointments with MongoDB database integration.

## Technology Stack
* **Frontend**: React (Vite, React Router, custom modern CSS)
* **Backend**: Express.js (Node.js, Custom Middleware)
* **Database**: MongoDB (Mongoose Schema Design & Validation)

---

## 1. Required Environment Variables

Create a `.env` file in the `backend/` directory using the template below:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hospitalDB
```

---

## 2. MongoDB Setup

1. **Install MongoDB**: Ensure you have MongoDB Community Server installed and running locally.
2. **Start Service**: Make sure the MongoDB service is active.
   - On Windows: Start it via Services Manager or run `net start MongoDB` in admin cmd.
   - On macOS/Linux: Run `brew services start mongodb-community` or `sudo systemctl start mongod`.
3. **Database Name**: The database is named `hospitalDB` (configured via `MONGO_URI` above). It will automatically populate the collections and seed initial doctors upon backend start.

---

## 3. Backend Setup & Run Command

Navigate to the `backend/` directory to install dependencies and run the server.

```bash
# Go to backend
cd backend

# Install dependencies
npm install

# Start the Express server
npm start
```
*The server will run on `http://localhost:5000`.*

---

## 4. Frontend Setup & Run Command

Navigate to the `frontend/` directory to install dependencies and run the client dashboard.

```bash
# Go to frontend
cd frontend

# Install dependencies
npm install

# Start the React/Vite development server
npm run dev
```
*The React client will run on `http://localhost:5173` (or the port specified by Vite).*

---

## Features Implemented
* **Modern Gradient UI**: Custom CSS variable system with beautiful layout panels, card grids, status badges, and spinners.
* **Doctors Search**: Real-time client-side filter to find clinical specialists.
* **Live Previews**: Dynamic state-synced preview showing the booked card before submission.
* **Auto-Seeding**: Automatic population of initial doctor records into MongoDB if the collections are empty.
* **Validation**: Full Mongoose-level validation (e.g. character constraints, uniqueness, enum states) with client-friendly structured error outputs.
