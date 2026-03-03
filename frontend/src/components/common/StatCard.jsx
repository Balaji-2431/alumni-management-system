import { motion } from "framer-motion";

const StatCard = ({ title, value, color, icon: Icon }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 200 }}
      className={`bg-brand-card border-l-4 ${color} rounded-2xl shadow-sm hover:shadow-md p-6 flex items-center justify-evenly hover:shadow-lg transition-shadow duration-300 `}
    >
        <div className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-wide text-brand-muted">{title}</p>
          <p className="text-4xl font-semibold mt-1 text-brand-dark">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-100">
            <Icon className="text-gray-700 text-2xl sm:text-2xl lg:text-3xl" />
        </div>
    </motion.div>
  );
};

export default StatCard;
