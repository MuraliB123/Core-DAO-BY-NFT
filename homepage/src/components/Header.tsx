import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Play, Search, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user?.type === 'creator') {
      window.location.href = 'http://localhost:8000';
    } else if (user?.type === 'user') {
      window.location.href = 'http://localhost:3000';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold">YouTube Clone</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Input
              placeholder="Search videos..."
              className="w-full pr-12"
            />
            <Button 
              size="sm" 
              className="absolute right-0 top-0 h-full px-4 rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button onClick={handleDashboardClick} variant="outline">
                My Dashboard
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.username}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/login')} variant="outline">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;