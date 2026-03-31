import { Header } from '@/components/dashboard/Header';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { TaskList } from '@/components/dashboard/TaskList';
import { ProgressRing } from '@/components/dashboard/ProgressRing';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Activity Heatmap and Progress Ring */}
          <div className="space-y-6">
            <ActivityHeatmap />
            <ProgressRing />
          </div>
          
          {/* Right Column - Task List */}
          <div>
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  );
}
