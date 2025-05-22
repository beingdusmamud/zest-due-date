
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CheckSquare, Menu, X, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";

export function NavBar() {
  const { user, profile, signOut } = useAuth();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(name => name[0]).join('').toUpperCase();
    } else if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const isLandingPage = location.pathname === "/";
  const isDarkTheme = theme === "dark";

  const determineTextColor = () => {
    if (isDarkTheme) return "text-white";
    if (isLandingPage && !isScrolled) return "text-white";
    return "text-gray-900";
  };

  const textColorClass = determineTextColor();

  return (
    <nav
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        (isScrolled || !isLandingPage || isDarkTheme) 
          ? isDarkTheme 
            ? "bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-slate-800" 
            : "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <CheckSquare className={`h-6 w-6 ${isScrolled || !isLandingPage || isDarkTheme ? "text-blue-600" : "text-white"}`} />
            <span className={`font-bold text-xl ${textColorClass}`}>TaskFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`hover:text-blue-500 ${textColorClass}`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/tasks"
                  className={`hover:text-blue-500 ${textColorClass}`}
                >
                  Tasks
                </Link>
                <Link
                  to="/notes"
                  className={`hover:text-blue-500 ${textColorClass}`}
                >
                  Notes
                </Link>
              </>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 m-0 h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-1 w-48">
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/notes">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Notes</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer" 
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth?mode=signin">
                  <Button 
                    variant="ghost"
                    className={isLandingPage && !isScrolled && !isDarkTheme ? "text-white hover:text-white hover:bg-white/20" : ""}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    className={isLandingPage && !isScrolled && !isDarkTheme ? "bg-white text-blue-600 hover:bg-blue-50" : ""}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className={`p-2 rounded-md ${textColorClass}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md ${
                  isDarkTheme 
                    ? "hover:bg-slate-800 text-gray-200" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    to="/tasks"
                    className={`px-3 py-2 rounded-md ${
                      isDarkTheme 
                        ? "hover:bg-slate-800 text-gray-200" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tasks
                  </Link>
                  <Link
                    to="/notes"
                    className={`px-3 py-2 rounded-md ${
                      isDarkTheme 
                        ? "hover:bg-slate-800 text-gray-200" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notes
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md ${
                      isDarkTheme 
                        ? "hover:bg-slate-800 text-gray-200" 
                        : "text-gray-700 hover:bg-gray-100"
                    } flex items-center`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className={`justify-start px-3 ${
                      isDarkTheme 
                        ? "text-red-400 hover:bg-slate-800" 
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=signin" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
