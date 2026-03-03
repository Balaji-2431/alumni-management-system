// import { useNavigate } from "react-router-dom";

// const RoleSelect = () => {
//   const navigate = useNavigate();

//   const handleSelect = (role) => {
//     navigate(`/auth/${role}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
//         <h1 className="text-2xl font-bold mb-6">Choose your role</h1>

//         <div className="flex flex-col gap-4">
//           <button
//             onClick={() => handleSelect("admin")}
//             className="py-3 rounded bg-black text-white hover:opacity-90"
//           >
//             Admin
//           </button>

//           <button
//             onClick={() => handleSelect("alumni")}
//             className="py-3 rounded bg-blue-600 text-white hover:opacity-90"
//           >
//             Alumni
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelect;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      key: "admin",
      title: "Admin",
      description: "Manage platform, approve content & monitor activity",
      icon: <FaUserShield size={28} />,
      color: "from-gray-800 to-black",
    },
    {
      key: "alumni",
      title: "Alumni",
      description: "Explore jobs, events & connect with the network",
      icon: <FaUserGraduate size={28} />,
      color: "from-blue-600 to-indigo-600",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('college.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
        >
          Choose Your Role
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/auth/${role.key}`)}
              className="cursor-pointer group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r ${role.color} mb-5`}
              >
                {role.icon}
              </div>

              <h2 className="text-xl font-semibold mb-2">
                {role.title}
              </h2>

              <p className="text-sm text-white/80">
                {role.description}
              </p>

              <div className="mt-6 text-sm font-medium opacity-80 group-hover:opacity-100 transition">
                Continue →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;