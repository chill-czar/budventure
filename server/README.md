# Task Management System - Backend API

A comprehensive MERN stack task management system with secure authentication, task CRUD operations, advanced filtering, and real-time statistics.

## Features

### 🔐 Authentication
- User registration with email validation
- JWT-based authentication
- Secure password hashing
- Protected routes

### 📋 Task Management
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Advanced Filtering**: Status, priority, assignee, tags, date ranges
- **Search**: Full-text search on title and description
- **Assignment**: Assign tasks to other users
- **Pagination**: Optimized performance for large datasets
- **Sorting**: Multiple sort options (due date, priority, status, etc.)

### 📊 Statistics & Analytics
- Task completion statistics
- Overdue task alerts
- Due date analytics (today, this week)
- Completion rate tracking
- Priority distribution analysis

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
GET    /api/auth/me           - Get current user profile
```

### Task Management Endpoints
```
GET    /api/tasks             - Get all tasks (with filtering, pagination, sorting)
POST   /api/tasks             - Create new task
GET    /api/tasks/:id         - Get single task
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
PUT    /api/tasks/:id/assign  - Assign task to user
```

### Statistics Endpoints
```
GET    /api/stats/tasks       - Get task statistics
GET    /api/stats/activity    - Get recent activity
```

## Query Parameters for Tasks

### Filtering:
- `status`: pending, in-progress, completed, cancelled
- `priority`: low, medium, high, urgent
- `assignedTo`: User ID
- `tag`: Tag name
- `dueDateFrom`: Start date (YYYY-MM-DD)
- `dueDateTo`: End date (YYYY-MM-DD)

### Search & Pagination:
- `search`: Full-text search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Sorting:
- `sortBy`: dueDate, priority, status, createdAt, updatedAt
- `sortOrder`: asc, desc

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/task-management
     JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
     JWT_EXPIRE=30d
     PORT=5000
     CLIENT_URL=http://localhost:3000
     ```

4. **Start MongoDB**
   ```bash
   # On Linux
   sudo systemctl start mongod

   # On macOS with Homebrew
   brew services start mongodb-community
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify server is running**
   - Visit `http://localhost:5000` for API info
   - Visit `http://localhost:5000/health` for health check

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create a task (Authenticated Request)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "dueDate": "2025-01-15",
    "priority": "high",
    "tags": ["documentation", "api"]
  }'
```

### Get tasks with filtering
```bash
curl "http://localhost:5000/api/tasks?status=pending&priority=high&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 10 minutes per IP
- **Input Validation**: Comprehensive input sanitization
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for production
- **Environment Variables**: Sensitive data stored securely

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Additional error details (optional)"
}
```

## Development

### Project Structure
```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── taskController.js    # Task CRUD operations
│   └── statsController.js   # Statistics endpoints
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User schema
│   └── Task.js              # Task schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── tasks.js             # Task routes
│   └── stats.js             # Stats routes
├── utils/
│   ├── asyncHandler.js      # Async error handling
│   ├── jwt.js               # JWT utilities
│   └── response.js          # Response formatting
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── server.js                # Express server entry point
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure the code follows the existing style
6. Submit a pull request

## License

MIT License

## Support

For questions or issues, please create an issue in the repository.
