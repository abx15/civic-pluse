# 🏙️ CivicPulse - Smart Civic Issue Reporting Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Build Status](https://img.shields.io/github/actions/workflow/status/abx15/civic-pulse/ci.yml?branch=main)](https://github.com/abx15/civic-pulse/actions)

**CivicPulse** is an enterprise-grade, open-source web application empowering citizens to report civic issues (potholes, garbage, streetlights) directly to authorities. It features real-time tracking, AI-powered categorization, and instant notifications via WhatsApp and Email.

---

## 🚀 Features

- **User & Authority Portals**: Secure authentication and specialized dashboards.
- **Real-time Reporting**: Image/Video upload, Geolocation, and AI analysis.
- **Instant Notifications**: WhatsApp (Twilio) and Email (Nodemailer) alerts.
- **Interactive Dashboards**: Track issue status from reported to resolved.
- **Mobile Responsive**: Optimized for all devices with a premium UI (TailwindCSS + GSAP).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, GSAP
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **DevOps**: Docker, GitHub Actions, Vercel

---

## 📂 Folder Structure

```
civic-pulse/
├── client/          # React Frontend (Vite)
├── server/          # Node.js Backend (Express)
├── .github/         # CI/CD & Community Files
├── Dockerfile       # Production Docker Setup
└── vercel.json      # Vercel Deployment Config
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js (v18+)
- MongoDB
- Git

### 1. Clone Repository

```bash
git clone https://github.com/abx15/civic-pulse.git
cd civic-pulse
```

### 2. Install Dependencies

```bash
# Install Client & Server dependencies
cd client && npm install
cd ../server && npm install
cd ..
```

### 3. Environment Variables

Create `.env` in `server/` and `client/` directories based on the examples in the documentation or previous setup.

### 4. Run Locally

```bash
# Start Backend
cd server
npm run dev

# Start Frontend (New Terminal)
cd client
npm run dev
```

---

## 🐳 Docker Support

Run the entire application in a production-ready container.

```bash
# Build and Run
docker build -t civic-pulse .
docker run -p 5000:5000 -e MONGO_URI=your_mongo_uri civic-pulse
```

_Note: The Docker image serves the frontend via the backend on port 5000._

---

## ☁️ Deployment

### Vercel (Frontend)

1. Import the repository to Vercel.
2. Set **Root Directory** to `client`.
3. The `vercel.json` and build scripts will handle the rest.
4. Set Environment Variables in Vercel Dashboard.

### Render/Railway (Backend)

1. Deploy the `server` directory or use the Dockerfile.
2. Ensure MongoDB connection string is set.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repo.
2. Create a feature branch.
3. Commit changes.
4. Push and open a Pull Request.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## ❤️ Support

If you like this project, please consider [sponsoring me](https://github.com/sponsors/abx15)!

---

**Author**: [Arun Kumar](https://github.com/abx15)
