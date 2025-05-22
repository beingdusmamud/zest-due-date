
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Calendar, List, Star, Clock, Flag, MoveRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect logged-in users to tasks page
  useEffect(() => {
    if (user) {
      navigate("/tasks");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 top-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Organize Tasks, <br/><span className="text-blue-200">Simplify Life</span>
              </h1>
              <p className="text-xl mb-10 text-blue-100 max-w-xl">
                TaskFlow helps you manage your tasks, set priorities, and stay on top of deadlines with an intuitive, powerful interface.
              </p>
              <div className="space-x-4 flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Get Started
                    <MoveRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signin">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-5/12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-2xl rotate-1 transform transition-transform hover:-rotate-1 duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1517432488278-a1124cf73dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="TaskFlow Dashboard" 
                  className="rounded-lg w-full h-auto object-cover shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Designed with productivity in mind, TaskFlow combines powerful features with elegant simplicity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<List className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Task List View" 
              description="Organize all your tasks in a clean, prioritized list view that helps you focus on what matters."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Calendar Integration" 
              description="See all your tasks in a calendar view to better plan your week and month ahead."
            />
            <FeatureCard 
              icon={<Flag className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Priority Levels" 
              description="Mark tasks with different priority levels to make sure you tackle the most important ones first."
            />
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Due Dates" 
              description="Never miss a deadline with clear due date indicators and reminders."
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Note Taking" 
              description="Capture ideas, details, and important information alongside your tasks."
            />
            <FeatureCard 
              icon={<CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Progress Tracking" 
              description="Track your productivity and see how many tasks you've completed over time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-indigo-700 dark:to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join thousands of users who have improved their productivity with TaskFlow.
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700 group hover:-translate-y-1 duration-300">
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 inline-block rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;
