import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const AlumniLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} />

      <div className={`app-shell ${open ? "sidebar-open" : ""} `}>
        <Navbar setOpen={setOpen} />
        <main className="main-content ">
          <Outlet />
        </main>
      </div>

      {open && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default AlumniLayout;
