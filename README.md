# CivicPulse 🚨

**Real-Time Civic Issue Reporting & Emergency Response System**

CivicPulse is a production-grade MERN stack application designed to bridge the gap between citizens and municipal authorities. It enables real-time issue reporting, SOS emergency alerts, and transparent tracking of civic problems.

## 🌟 Key Features

### For Citizens

- **Instant Issue Reporting**: Report potholes, garbage, or outages with geolocation and photos.
- **SOS Emergency System**: One-tap alert for Accident, Fire, Medical, or Crime emergencies.
- **Live Status Tracking**: Watch your report go from "Pending" to "Resolved" in real-time.
- **Safety First**: Live authority assignment notifications.

### For Authorities

- **Command Center Dashboard**: centralized view of all active emergencies and issues.
- **Real-Time Dispatch**: Instant notification when an SOS is triggered.
- **SLA Monitoring**: Track response times and prioritize critical incidents.
- **Department Filtering**: Focused view for Public Works, Traffic, Health, etc.

## 🏗 Architecture

- **Frontend**: React 19 (Vite), Tailwind CSS v4, GSAP Animations.
- **Backend**: Node.js, Express.js (MVC Pattern).
- **Database**: MongoDB (Mongoose) with Geospatial indexing capabilities.
- **Real-Time**: Socket.io for bi-directional event streaming.
- **Media**: Cloudinary integration for evidence uploads.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for media uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abx15/CivicPulse.git
   cd CivicPulse
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   # Create .env file from .env.example
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   # Create .env file from .env.example
   npm run dev
   ```

4. **Access the App**
   - Citizen View: `http://localhost:5173`
   - Authority View: `http://localhost:5173/authority` (Requires Authority Account)

## 📡 API Overview

| Method   | Endpoint              | Description                    |
| :------- | :-------------------- | :----------------------------- |
| **POST** | `/api/auth/register`  | Register new citizen           |
| **POST** | `/api/auth/login`     | Login (Citizen/Authority)      |
| **POST** | `/api/issues`         | Report a new issue (Multipart) |
| **GET**  | `/api/issues`         | Get feed of local issues       |
| **POST** | `/api/sos`            | Trigger SOS Alert              |
| **PUT**  | `/api/sos/:id/assign` | Authority takes ownership      |
| **GET**  | `/api/analytics`      | Admin Dashboard Metrics        |

## 🔮 Future Roadmap

- [ ] Mobile App (React Native)
- [ ] AI-based Issue Categorization
- [ ] WhatsApp Integration for Alerts
- [ ] City-wide Heatmaps

---

# Developer & Designer 
## Arun Kumar Bind