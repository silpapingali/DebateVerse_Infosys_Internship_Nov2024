# DebateHub

DebateHub is a full-stack web application that facilitates engaging discussions by allowing users to create and participate in debates on a variety of topics. The platform supports multiple viewpoints, voting, and analytics for each debate topic.

## Features
- User Registration and Login (with JWT authentication).
- Role-based access control (Admin and User dashboards).
- Create, participate in, and vote on debates.
- Real-time email notifications using Nodemailer.
- Analytics and visualizations of debate metrics using Chart.js and Recharts.
- Responsive design with Tailwind CSS.

## Tech Stack
### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for storing users, debates, and related data.
- **Nodemailer**: Email service for sending notifications.
- **Node-Cron**: Task scheduling for periodic operations.

#### Key Libraries
- **bcryptjs**: For password hashing.
- **jsonwebtoken & jwt-decode**: For secure authentication.
- **mongoose**: MongoDB object modeling.

### Frontend
- **React.js**: Component-based UI library.
- **Vite**: Development server and build tool.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: For client-side routing.
- **React-Chartjs-2 & Recharts**: Data visualization libraries for analytics.
- **Axios**: HTTP client for API requests.
- **Firebase**: For hosting and optional user authentication.

#### Key Libraries
- **react-hook-form**: For managing form state and validation.
- **react-icons**: For adding scalable icons.
- **chart.js**: Core visualization library for charts.

## Installation and Setup
### Prerequisites
- Node.js and npm installed.
- MongoDB instance running locally or in the cloud.

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run server
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Full-Stack Development
Run both the backend and frontend concurrently:
```bash
npm run dev
```

## Usage
1. Register a new user or log in with existing credentials.
2. Admin users can create debate topics and manage the platform.
3. Users can participate in debates, vote on viewpoints, and view analytics.

## Screenshots


---

For more details, contact **Leela** at [213j1a4254@raghuinstech.com].
