# Task Management System (MERNGinated)

A full-stack MERN task management application with modern architecture, featuring secure authentication, comprehensive task management, real-time updates, and analytics dashboard.

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)](https://en.wikipedia.org/wiki/MERN_stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.0+-blue.svg)](https://docs.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18+-black.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg)](https://nodejs.org/)

## 🚀 Features

### 🔐 Secure Authentication
- User registration and login with email validation
- JWT token-based authentication with refresh capabilities
- Protected routes and session management
- Password encryption using bcrypt

### 📋 Complete Task Management
- **Full CRUD Operations**: Create, Read, Update, Delete tasks
- **Advanced Filtering**: Filter by status, priority, assignee, tags, date ranges
- **Search Functionality**: Full-text search on task titles and descriptions
- **Task Assignment**: Assign tasks to multiple users
- **Pagination**: Efficient handling of large task datasets
- **Sorting Options**: Sort by due date, priority, status, creation date

### 📊 Analytics Dashboard
- **Task Statistics**: Completion rates, overdue tasks, priority distribution
- **Real-time Updates**: Live data synchronization
- **Date Analytics**: Tasks due today, this week, upcoming
- **Activity Tracking**: Recent user activities and task modifications

### 🎨 Modern User Interface
- **Responsive Design**: Mobile-first approach, works on all devices
- **Intuitive UI**: Clean, modern interface with smooth animations
- **Real-time Feedback**: Loading states, form validation, error handling
- **Context-aware Navigation**: Smart routing based on authentication status

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React)       │    │   (Express)     │
│                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Components  ││    │  │ Controllers ││
│  └─────────────┘│    │  └─────────────┘│
│                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Pages       ││    │  │ Models      ││
│  └─────────────┘│    │  └─────────────┘│
│                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│
│  │ API Layer   ││◄──►│  │ Routes      ││
│  └─────────────┘│    │  └─────────────┘│
│                 │    │                 │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    Database     │
                       │    (MongoDB)    │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Context API** - Global state management
- **CSS** - Styling (mobile-responsive)

## 📦 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budventure
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Verify the API base URL is set correctly
   ```

4. **Start MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongod

   # macOS (Homebrew)
   brew services start mongodb-community

   # Windows (MongoDB as service)
   net start MongoDB
   ```

5. **Start the Application**

   *Terminal 1: Backend*
   ```bash
   cd server
   npm run dev
   ```

   *Terminal 2: Frontend*
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api`

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user profile
```

### Task Management
```
GET    /api/tasks             - Get tasks (with filtering/pagination)
POST   /api/tasks             - Create new task
GET    /api/tasks/:id         - Get single task
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
PUT    /api/tasks/:id/assign  - Assign task to user
```

### Statistics
```
GET    /api/stats/tasks       - Get task statistics
GET    /api/stats/activity    - Get recent activity
```

## 🎯 Usage Examples

### Quick Start Guide
1. **Register** a new account on the signup page
2. **Login** with your credentials
3. **Create your first task** using the task form
4. **Explore** the dashboard for statistics and task management
5. **Filter and search** tasks as needed

### API Usage Examples

*Register a new user*
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

*Create a task*
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "dueDate": "2025-01-15",
    "priority": "high",
    " tags": ["documentation", "api"]
  }'
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Comprehensive validation and sanitization
- **Rate Limiting**: Protection against abuse and DoS attacks
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet middleware for production security

## 📁 Project Structure

```
budventure/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route protection
│   │   └── ...
│   ├── package.json
│   └── README.md          # Frontend documentation
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   └── ...
│   ├── package.json
│   └── README.md          # Backend documentation
│
├── .gitignore
└── README.md              # Project overview (this file)
```

## 🧪 Testing

### End-to-End Testing
```bash
# Start MongoDB, backend, and frontend in separate terminals
# Visit http://localhost:5173 and test the application flow

# Test authentication
# Test task CRUD operations
# Test filtering and search
# Test statistics dashboard
```

### API Testing
```bash
# Test a simple endpoint
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🚀 Deployment

### Environment Variables

**Server (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/task-management-prod
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=30d
PORT=5000
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

**Client (.env)**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Production Build Commands
```bash
# Backend
cd server && npm run build

# Frontend
cd client && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contributing Guidelines
- Follow the existing code style and structure
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Check the documentation in `client/README.md` and `server/README.md`
- Review the API endpoints and examples above

## 🔄 Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] File attachments for tasks
- [ ] Task templates and recurring tasks
- [ ] Team collaboration features
- [ ] Advanced analytics with charts
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Calendar view integration

---

**Happy task managing! 🎯**
