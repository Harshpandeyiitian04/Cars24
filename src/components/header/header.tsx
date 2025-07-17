// src/components/header/header.tsx
import React, { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  Package,
  FileText,
  HelpCircle,
  Users,
  Menu,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/AuthProvider";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface UserForm {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  avatar_url?: string;
}

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [localUser, setLocalUser] = useState<UserForm | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        setLocalUser({
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          avatar_url: `https://gravatar.com/avatar/60c15dac066f8398cddce235cb38a097?s=400&d=robohash&r=x`,
        });
      } else {
        setLocalUser(null);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  const navItems = [
    { name: "Buy used cars", href: "/buy-car" },
    { name: "Sell cars", href: "/sell-car" },
    { name: "Car finance", href: "/finance" },
    { name: "New cars", href: "/new-car" },
    { name: "Car services", href: "/services", hasDropdown: true },
  ];

  const menuItems = [
    { label: "My Appointments", icon: Calendar, link: "/appointments" },
    { label: "My Bookings", icon: Package, link: "/bookings" },
    { label: "My Orders", icon: FileText, link: "/orders" },
    { label: "Resources", icon: FileText, link: "/resources" },
    { label: "Rc Transfer Status", icon: FileText, link: "/rc-transfer" },
    { label: "Become Our Partner", icon: Users, link: "/partner" },
    { label: "FAQ", icon: HelpCircle, link: "/faq" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Cars24</span>
            <div className="flex items-center">
              <span className="bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-lg">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-lg">24</span>
            </div>
          </Link>
        </div>
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Open main menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-x-4 ml-4">
          <button className="flex items-center gap-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <Heart className="w-5 h-5" />
            Wishlist
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-x-2 px-3 py-2"
              >
                {localUser && localUser.fullname ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={localUser.avatar_url}
                      alt={localUser.fullname}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="hidden sm:inline">{localUser.fullname}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-7 h-7" />
                    <span className="hidden sm:inline">Guest</span>
                  </div>
                )}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px] bg-white shadow-lg rounded-md p-2">
              {localUser && localUser.fullname ? (
                <>
                  <DropdownMenuItem
                    className="text-black hover:bg-gray-100 rounded px-2 py-1.5 cursor-pointer"
                    asChild
                  >
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 hover:bg-gray-100 rounded px-2 py-1.5 cursor-pointer"
                    onClick={() => {
                      logout();
                      setLocalUser(null);
                      toast.success("Logged out successfully");
                      router.push("/login");
                    }}
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="text-blue-700 hover:bg-gray-100 rounded px-2 py-1.5 cursor-pointer"
                  asChild
                >
                  <Link href="/login">Login / SignUp</Link>
                </DropdownMenuItem>
              )}
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className="text-black hover:bg-gray-100 rounded px-2 py-1.5 cursor-pointer"
                  asChild
                >
                  <Link href={item.link} className="flex items-center gap-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}