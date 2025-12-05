import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navbar05 } from "@/components/ui/shadcn-io/navbar-05";

const DashboardHeader = React.memo(() => {
  const { user, logout } = useAuth();

  const handleUserMenuClick = (item) => {
    switch (item) {
      case 'logout':
        logout();
        break;
      case 'profile':
        // Could navigate to profile page in future
        console.log('Profile clicked');
        break;
      case 'settings':
        // Could navigate to settings page in future
        console.log('Settings clicked');
        break;
      default:
        console.log('Unknown menu item:', item);
    }
  };

  return (
    <Navbar05
      logo={<span className="text-xl font-bold">Task Management</span>}
      userName={user?.name || "User"}
      userEmail={user?.email || ""}
      navigationLinks={[]} // Empty for dashboard - no top navigation needed
      onUserItemClick={handleUserMenuClick}
      className="border-b"
    />
  );
});

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
