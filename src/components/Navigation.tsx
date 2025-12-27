import { NavLink } from "@/components/NavLink";
import { Home, Target, Calendar, Settings as SettingsIcon } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/holiday-planner", label: "Holiday Planner", icon: Calendar },
    { to: "/target-achievement", label: "Target Achievement", icon: Target },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AttendTrack</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                activeClassName="!text-primary !bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </div>

          <div className="md:hidden">
            <select 
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm"
              onChange={(e) => window.location.href = e.target.value}
            >
              {navItems.map((item) => (
                <option key={item.to} value={item.to}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
