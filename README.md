# 🏙️ CivicPulse - Smart Civic Issue Reporting Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)
![Stack](https://img.shields.io/badge/stack-MERN-blueviolet.svg)

**CivicPulse** is a modern, responsive web application designed to empower citizens to report civic issues (like potholes, garbage, streetlights) directly to authorities. It bridges the gap between the community and the administration with real-time tracking, AI-powered categorization, and instant notifications via WhatsApp and Email.

---

## 🚀 Features

### 🌟 Core Functionality

- **User Registration & Login**: Secure authentication for Citizens and Authorities.
- **Report Issues**: Easy-to-use form to report issues with:
  - **Image/Video Upload**: Visual proof via Cloudinary.
  - **Live Geolocation**: Auto-detect location coordinates.
  - **AI Categorization**: Automatically categorizes issues and assigns priority.
- **Real-time Notifications**:
  - **WhatsApp**: Instant confirmation to users and alerts to admins (via Twilio).
  - **Email**: Professional email confirmations (via Nodemailer).
- **Interactive Dashboards**:
  - **Citizen Dashboard**: Track reported issues and view status updates.
  - **Authority Dashboard**: Manage, update, and resolve issues efficiently.

### ✨ Enhancements

- **Image Preview**: View images before submitting reports.
- **Toast Notifications**: Immediate success/failure feedback (e.g., "Report Submitted", "Email Sent").
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- **Modern UI/UX**: Built with TailwindCSS and GSAP animations for a premium feel.

---

## 🛠️ Tech Stack

### Frontend

- ![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61DAFB) **React.js**: Component-based UI.
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**: Utility-first styling.
- ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white) **GSAP**: Smooth animations.
- **Vite**: Fast build tool.

### Backend

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js**: Runtime environment.
- ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) **Express.js**: Web framework.
- **Socket.io**: Real-time bidirectional communication.

### Database

- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB**: NoSQL database for flexible data storage.

### Services & APIs

- **Twilio API**: WhatsApp notifications.
- **Nodemailer**: Email services (SMTP).
- **Cloudinary**: Image and video storage.
- **OpenAI (Optional)**: AI-based issue categorization.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/civic-pulse.git
cd civic-pulse
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicpulse
JWT_SECRET=your_super_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+1234567890
```

Start the backend server:

```bash
npm run dev
# Server running on port 5000
```

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
# App running at http://localhost:5173
```

---

## 📖 Usage

1.  **Register/Login**: Create an account as a "Citizen".
2.  **Submit Report**:
    - Click "Report Issue".
    - Fill in details, upload an image, and let the app detect your location.
    - Submit and wait for the success toast and email/WhatsApp confirmation.
3.  **Dashboard**:
    - View your reported issues.
    - See status updates (Pending -> In Progress -> Resolved).
4.  **Admin Login** (Optional):
    - Log in as an authority to view all reports and update statuses.

---

## � Folder Structure

```
civic-pulse/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Socket Context
│   │   ├── pages/          # Application Pages (Login, Report, Dashboard)
│   │   ├── services/       # API Service calls (axios)
│   │   └── App.jsx         # Main App Component
│   └── ...
├── server/                 # Node.js Backend
│   ├── config/             # DB & Cloudinary Config
│   ├── controllers/        # Route Logic (Issue, Auth)
│   ├── models/             # Mongoose Models (User, Issue)
│   ├── routes/             # API Routes
│   ├── services/           # Mailing & WhatsApp Services
│   ├── middleware/         # Auth & Upload Middleware
│   └── index.js            # Server Entry Point
└── README.md               # Project Documentation
```

---

## 📸 Screenshots

|                                Login Page                                 |                                  Register Page                                  |
| :-----------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![Login Placeholder](https://via.placeholder.com/300x200?text=Login+Page) | ![Register Placeholder](https://via.placeholder.com/300x200?text=Register+Page) |

|                              Citizen Dashboard                               |                                 Report Issue                                 |                                    Notifications                                    |
| :--------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Dashboard Placeholder](https://via.placeholder.com/300x200?text=Dashboard) | ![Report Placeholder](https://via.placeholder.com/300x200?text=Report+Issue) | ![Notification Placeholder](https://via.placeholder.com/300x200?text=Notifications) |

---

## 🤝 Contribution

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📞 Contact

**Author**: [Your Name/Arun K]

- **GitHub**: [github.com/abx15](https://github.com/abx15)
- **LinkedIn**: [linkedin.com/in/arun-kumar-a3b047353/](https://linkedin.com/in/arun-kumar-a3b047353/)
- **Email**: developerarunwork@gmail.com

Happy Coding! 🚀
