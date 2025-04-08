
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { Compass, Heart, Route, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, loginAsDemoUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDemoLogin = async () => {
    await loginAsDemoUser();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-travel-primary" />
          <span className="font-bold text-xl">Journey Compass</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/routes" className={navigationMenuTriggerStyle()}>
                  Маршруты
                </Link>
              </NavigationMenuItem>
              
              {user && (
                <>
                  <NavigationMenuItem>
                    <Link to="/favorites" className={navigationMenuTriggerStyle()}>
                      Избранное
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Создать</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[200px] gap-3 p-4">
                        <NavigationMenuLink asChild>
                          <Link to="/routes/create" className="flex items-center gap-2 text-sm font-medium hover:text-travel-primary">
                            <Route className="h-4 w-4" />
                            <span>Создать маршрут</span>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user.profile_image_url} alt={user.username} />
                  <AvatarFallback className="bg-travel-primary text-white">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link to="/favorites">
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Избранное</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleDemoLogin} className="bg-travel-primary hover:bg-travel-primary/90">
              Демо-режим
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t p-4">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/routes" 
              className="py-2 px-3 hover:bg-muted rounded-md" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Маршруты
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/favorites" 
                  className="py-2 px-3 hover:bg-muted rounded-md" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Избранное
                </Link>
                
                <Link 
                  to="/routes/create" 
                  className="py-2 px-3 hover:bg-muted rounded-md" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Создать маршрут
                </Link>
              </>
            )}
            
            {user ? (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-3 mb-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_image_url} alt={user.username} />
                    <AvatarFallback className="bg-travel-primary text-white">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-travel-primary hover:bg-travel-primary/90" 
                onClick={handleDemoLogin}
              >
                Демо-режим
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
