import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Task Management System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Organize your tasks efficiently with our comprehensive task management platform.
            Create, assign, track, and complete tasks with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border border-blue-600 transition duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">Create, edit, delete, and organize your tasks with advanced filtering and search.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-3-3m-4 0V9a3 3 0 013-3m-4 0V4a1 1 0 011-1h2a1 1 0 011 1v1m-6 0a1 1 0 011-1h2a1 1 0 011 1v1M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 013-3m4 0V9a3 3 0 013-3M4.464 7.464a1 1 0 011.414 0l1.414-1.414a1 1 0 011.414 1.414L7.88 9.879a1 1 0 01-1.414 0L4.464 7.464zm0 4.95a1 1 0 011.414 0l1.414-1.414a1 1 0 011.414 1.414L7.88 14.83a1 1 0 01-1.414 0l-2.536-2.536zm5 0a1 1 0 011.414 0L14.83 9.879a1 1 0 000-1.414l-2.536-2.536a1 1 0 00-1.414 0l-2.536 2.536z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Assign tasks to team members and track progress across your organization.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-600">Get detailed statistics and insights about your task completion and team productivity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
