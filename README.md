# Lab Management System

A full-stack lab inventory management application with role-based dashboards for administrators, technicians, and researchers.

## Features

- Admin: manage categories, items, suppliers, stock in/out, alerts, and complaints
- Technician: view lab inventory, researchers, stock alerts, and complaints
- Researcher: browse inventory and file/view complaints
- Authentication with JWT
- MongoDB-backed API using Express and Mongoose

## Tech Stack

- Frontend: React, React Router, MUI, Axios, react-toastify
- Backend: Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken

## Project Structure

- `client/` - React application
- `server/` - Express API server

## Setup

### Backend

1. Navigate to `server`
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Create a `.env` file with:
   ```bash
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to `client`
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Usage

- Open the React app in your browser (default: `http://localhost:3006`)
- Sign in or register
- Use role-specific dashboards for admin, technician, or researcher workflows

## Notes

- Ensure the backend is running before using the frontend
- Configure MongoDB and JWT values correctly in `.env`
