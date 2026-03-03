import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import "./Sidebar.css";
import ConfirmModal from "../../components/common/ConfirmModal";

import {
  BiMenu,
  BiMenuAltRight,
  BiGridAlt,
  BiUser,
  BiBriefcase,
  BiCalendarEvent,
  BiBroadcast,
} from "react-icons/bi";

const MENUS = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: BiGridAlt },
    { label: "Alumni", path: "/admin/alumni", icon: BiUser },
    { label: "Jobs", path: "/admin/jobs", icon: BiBriefcase },
    { label: "Events", path: "/admin/events", icon: BiCalendarEvent },
    // { label: "Broadcast", path: "/admin/broadcast", icon: BiBroadcast },
  ],
  alumni: [
    { label: "Dashboard", path: "/alumni/dashboard", icon: BiGridAlt },
    { label: "My Profile", path: "/alumni/profile", icon: BiUser },
    { label: "Jobs", path: "/alumni/jobs", icon: BiBriefcase },
    { label: "Events", path: "/alumni/events", icon: BiCalendarEvent },
  ],
};

const Sidebar = ({ open, setOpen }) => {
  const { role, logout } = useContext(AuthContext);
  const searchRef = useRef(null);
  const sidebarRef = useRef(null);
  const menu = MENUS[role] || [];
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

const handleLogout = () => {
  setConfirm({
    open: true,
    title: "Log out",
    message: "Are you sure you want to log out? You’ll need to sign in again to continue.",
    action: () => {
      setOpen(false);
      logout();
      navigate("/");
    }
  });
};

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <>

       <aside ref={sidebarRef} className={`sidebar ${open ? "open" : ""}`}>

        <div className="logo_details">
          <div className="logo_name">
            {role === "admin" ? "Admin Panel" : "Alumni Panel"}
          </div>

          <div id="btn" onClick={() => setOpen(!open)}>
            {open ? <BiMenuAltRight size={32} /> : <BiMenu size={32}/>}
          </div>
        </div>

        <ul className="nav-list flex flex-col h-full">

          {menu.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={()=>setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center ${isActive ? "active" : ""}`
                }
              >
                <Icon />
                <span className="link_name">{label}</span>
              </NavLink>
              <span className="tooltip">{label}</span>
            </li>
          ))}

          <li className="profile mt-auto">
            <a
              role="button"
              tabIndex={0}
              onClick={handleLogout}
              className="flex items-center cursor-pointer">
              <FiLogOut />
              <span className="link_name">Logout</span>
            </a>
            <span className="tooltip">Logout</span>
          </li>
        </ul>
      {confirm.open && (
        <ConfirmModal
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() =>
            setConfirm((p) => ({ ...p, open: false }))
          }
        />
      )}
    </aside>

    </>
  );
};

export default Sidebar;
