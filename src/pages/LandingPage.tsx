
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckSquare, Calendar, List, Star, Clock, Flag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Organize Your Tasks, <br/>Simplify Your Life
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                TaskFlow helps you manage your daily tasks, set priorities, and never miss a deadline again.
              </p>
              <div className="space-x-4">
                {user ? (
                  <Link to="/tasks">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signin">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1517432488278-a1124cf73dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="TaskFlow Dashboard" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Everything You Need to Stay Organized
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<List className="w-8 h-8 text-blue-600" />}
              title="Task List View" 
              description="Organize all your tasks in a clean, prioritized list view that helps you focus on what matters."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-blue-600" />}
              title="Calendar Integration" 
              description="See all your tasks in a calendar view to better plan your week and month ahead."
            />
            <FeatureCard 
              icon={<Flag className="w-8 h-8 text-blue-600" />}
              title="Priority Levels" 
              description="Mark tasks with different priority levels to make sure you tackle the most important ones first."
            />
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-blue-600" />}
              title="Due Dates" 
              description="Never miss a deadline with clear due date indicators and reminders."
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-blue-600" />}
              title="Categories" 
              description="Group your tasks by categories to keep your personal and work tasks separate."
            />
            <FeatureCard 
              icon={<CheckSquare className="w-8 h-8 text-blue-600" />}
              title="Progress Tracking" 
              description="Track your productivity and see how many tasks you've completed over time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of users who have improved their productivity with TaskFlow.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckSquare className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">TaskFlow</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
