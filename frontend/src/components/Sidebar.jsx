import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Timer,
  CalendarDays,
  BarChart3,
  Settings,
  GraduationCap
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">
          <GraduationCap size={26} />
        </div>

        <div>
          <h2>StudyFlow</h2>
          <p>Learn • Plan • Achieve</p>
        </div>
      </div>

      {/* Navigation */}
      <nav>

        <NavLink to="/" end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/subjects">
          <BookOpen size={20} />
          <span>Subjects</span>
        </NavLink>

        <NavLink to="/tasks">
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/timer">
          <Timer size={20} />
          <span>Study Timer</span>
        </NavLink>

        <NavLink to="/calendar">
          <CalendarDays size={20} />
          <span>Calendar</span>
        </NavLink>

        <NavLink to="/analytics">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* Bottom message */}
      <div className="sidebar-tip">
        <div className="tip-icon">🌱</div>

        <div>
          <strong>Small steps</strong>
          <p>every day lead to big results.</p>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;