import { FaHandPaper } from "react-icons/fa";

const DashboardHeader = ({ user }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
        Hi, {user.name}
        <FaHandPaper className="text-amber-500" />
      </h1>
      <p className="text-base text-brand-muted mt-1">Here's what needs your attention</p>
    </div>
    <p className="text-sm text-brand-muted">
      {new Date().toLocaleDateString()}
    </p>
  </div>
);

export default DashboardHeader;
