# Task Management System - Frontend

A modern React frontend for a comprehensive task management system, built with Vite, featuring secure authentication, real-time task updates, and an intuitive user interface.

## 🚀 Features

### 🔐 Authentication
- User registration and login with form validation
- JWT token-based secure authentication
- Persistent login state management
- Protected routes and automatic redirects

### 📋 Task Management
- **Create, Read, Update, Delete** tasks with intuitive forms
- **Advanced filtering** by status, priority, tags, and due dates
- **Search functionality** across task titles and descriptions
- **Task assignment** to other users
- **Real-time updates** with optimistic UI updates
- **Responsive design** works on all devices

### 📊 Dashboard & Analytics
- Welcome dashboard with quick overview
- **Task statistics** integration (completion rates, overdue tasks)
- **Interactive data visualization** for task metrics
- **Activity tracking** and productivity insights

### 🎨 User Experience
- **Modern UI** built with React and CSS
- **Responsive design** for mobile and desktop
- **Loading states** and error handling
- **Form validation** with helpful error messages
- **Navigation guards** and route protection

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Context API** - Global state management
- **CSS** - Component styling
- **Vitest** - Testing framework

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Visit `http://localhost:5173`
   - The development server supports hot module replacement

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## 🏗️ Project Structure

```
client/
├── src/
│   ├── api/              # API service functions
│   │   ├── api.js        # Base API configuration
│   │   ├── auth.js       # Authentication API calls
│   │   ├── tasks.js      # Task management API calls
│   │   └── stats.js      # Statistics API calls
│   ├── components/       # Reusable UI components
│   │   ├── TaskForm.jsx  # Task creation/editing form
│   │   └── TaskList.jsx  # Task display and management
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js   # Authentication hooks
│   │   └── useTasks.js  # Task management hooks
│   ├── pages/           # Page components
│   │   ├── Landing.jsx  # Public landing page
│   │   ├── Login.jsx    # Login page
│   │   ├── Signup.jsx   # Registration page
│   │   └── Dashboard.jsx# Main dashboard
│   ├── routes/          # Route protection
│   │   └── ProtectedRoute.jsx # Auth guard component
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint the code
npm run lint

# Run tests (if configured)
npm run test
```

### Key Components

#### Authentication Flow
- `AuthContext`: Manages global authentication state
- `useAuth`: Hook providing login, register, logout functionality
- `ProtectedRoute`: Guards authenticated routes

#### Task Management
- `useTasks`: Hook for task CRUD operations
- `TaskForm`: Create/edit task component
- `TaskList`: Display and manage task lists

#### API Integration
- Centralized API calls in `/api` folder
- TanStack Query for caching and synchronization
- Proper error handling and loading states

## 🌐 API Integration

The frontend integrates with the backend API providing:

- **Authentication**: Login, register, profile management
- **Tasks**: Full CRUD operations with filtering
- **Statistics**: Dashboard analytics and metrics

Ensure the backend server is running on the configured API URL.

## 🎯 Features in Detail

### Authentication
- Secure JWT-based authentication
- Form validation and error display
- Automatic token refresh and logout
- Protected route navigation

### Task Operations
- Create tasks with title, description, priority, due dates
- Edit existing tasks with form pre-population
- Delete tasks with confirmation
- Filter and search tasks efficiently
- Mark tasks as complete/incomplete

### Dashboard
- Welcome message with user context
- Statistics display for productivity tracking
- Quick access to create new tasks
- Overview of recent activities

## 💡 Contributing

1. Follow the existing code structure
2. Use meaningful component and function names
3. Add proper error handling
4. Test components after changes
5. Ensure responsive design

## 📄 License

MIT License
