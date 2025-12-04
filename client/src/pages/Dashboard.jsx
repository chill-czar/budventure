import { useStats } from '../hooks/useStats';
import ErrorBoundary from '../components/ErrorBoundary';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import TaskManagement from '../components/dashboard/TaskManagement';

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ErrorBoundary>
            <StatsOverview
              taskStats={statsData}
              statsLoading={statsLoading}
              hasErrors={!!statsError}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <TaskManagement />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
