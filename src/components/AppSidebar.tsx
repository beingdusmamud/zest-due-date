
import { Calendar, List, CheckSquare, BarChart3 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentView: 'list' | 'calendar';
  setCurrentView: (view: 'list' | 'calendar') => void;
}

export function AppSidebar({ currentView, setCurrentView }: AppSidebarProps) {
  const menuItems = [
    {
      title: "Task List",
      icon: List,
      view: 'list' as const,
      description: "View all tasks"
    },
    {
      title: "Calendar",
      icon: Calendar,
      view: 'calendar' as const,
      description: "Calendar view"
    },
  ];

  return (
    <Sidebar className="bg-white/80 backdrop-blur-sm border-r border-gray-200/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">TaskFlow</h2>
            <p className="text-sm text-gray-500">Task Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">
            Views
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentView(item.view)}
                    className={`w-full justify-start transition-all duration-200 ${
                      currentView === item.view 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${
                      currentView === item.view ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-gray-600 font-medium">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Work</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Personal</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Shopping</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Health</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-700">Other</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
