# Local Development Setup

This guide will help you run the TwitterAI Pro application locally with the frontend on port 8080 and backend on port 5000.

## Prerequisites

1. Node.js 18+ installed
2. MongoDB database (or MongoDB Atlas account)

## Running the Application

### 1. Start the Backend Server

Open a terminal and navigate to the backend directory:
```bash
cd backend
npm run dev
```

The backend server will start on port 5000.

### 2. Start the Frontend Server

Open a new terminal in the root project directory:
```bash
npm run dev
```

The frontend will start on port 8080.

### 3. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## Environment Variables

The application is already configured to work with the default ports:
- Frontend (.env): VITE_API_URL=http://localhost:5000
- Backend (.env): PORT=5000 and FRONTEND_URL=http://localhost:8080

These settings ensure that:
1. The frontend communicates with the backend API at http://localhost:5000
2. The backend accepts requests from the frontend at http://localhost:8080
3. Both applications run on their respective ports without conflicts

## Troubleshooting

### Port Conflicts
If either port is already in use, you can:
1. Stop the application using the port, or
2. Change the port in the respective configuration files

### CORS Issues
If you encounter CORS errors:
1. Ensure FRONTEND_URL in backend/.env matches your frontend URL
2. Restart both servers after making changes

### Database Connection
If you have issues connecting to MongoDB:
1. Verify your MONGO_URI in backend/.env is correct
2. Ensure your MongoDB instance is accessible