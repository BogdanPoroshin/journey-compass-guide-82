
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Compass, Map, Search, Menu, X, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <nav className="bg-travel-primary text-white py-3 px-4 md:px-6 lg:px-8 relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Compass className="h-6 w-6" />
          <span>JourneyCompass</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-travel-secondary/20 transition-colors"
                >
                  <Link to="/routes">Explore Routes</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-travel-secondary/20 focus:bg-travel-secondary/20">
                  Discover
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-travel-accent/50 to-travel-accent p-6 no-underline outline-none focus:shadow-md"
                          href="/categories/popular"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-travel-secondary">
                            Popular Routes
                          </div>
                          <p className="text-sm leading-tight text-travel-secondary/90">
                            Discover the most loved travel routes around the world
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {["Beach", "Mountain", "City", "Road Trip"].map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/categories/${category.toLowerCase()}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{category}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore {category.toLowerCase()} routes
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-travel-secondary/20 transition-colors"
                >
                  <Link to="/map">
                    <Map className="h-4 w-4 mr-2 inline" />
                    Map View
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-travel-secondary/20"
                >
                  <Link to="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-travel-accent">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-travel-secondary">JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-routes" className="cursor-pointer">My Routes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer">Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-white hover:text-white hover:bg-travel-secondary/20">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="bg-white text-travel-primary hover:bg-travel-accent hover:text-travel-secondary">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-travel-primary flex flex-col py-4 px-6 md:hidden">
            <Link
              to="/routes"
              className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
              onClick={() => setIsOpen(false)}
            >
              Explore Routes
            </Link>
            <Link
              to="/categories/popular"
              className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
              onClick={() => setIsOpen(false)}
            >
              Popular Routes
            </Link>
            <Link
              to="/map"
              className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
              onClick={() => setIsOpen(false)}
            >
              Map View
            </Link>
            <Link
              to="/search"
              className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>

            <div className="border-t border-white/20 my-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="py-2 px-4 hover:bg-travel-secondary/20 rounded flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/my-routes"
                    className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    My Routes
                  </Link>
                  <Link
                    to="/favorites"
                    className="py-2 px-4 hover:bg-travel-secondary/20 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Favorites
                  </Link>
                  <button
                    className="w-full text-left py-2 px-4 hover:bg-travel-secondary/20 rounded flex items-center"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start text-white hover:text-white hover:bg-travel-secondary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-white text-travel-primary hover:bg-travel-accent hover:text-travel-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
