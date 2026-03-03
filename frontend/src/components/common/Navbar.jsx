import { BiMenu } from "react-icons/bi";

const Navbar = ({ setOpen }) => {
  return (
    <div className="sm:hidden h-14 bg-white shadow w-full flex items-center px-3 gap-3
                    sticky top-0 z-30">
      <BiMenu
        size={32}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <h1 className="font-semibold">
        Alumni Management System
      </h1>
    </div>
  );
};

export default Navbar;
