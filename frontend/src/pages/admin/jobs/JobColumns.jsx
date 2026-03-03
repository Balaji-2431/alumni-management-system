import Actions from "../../../components/admin/Actions";

const jobColumns = ({
  onView,
  onApprove,
  onDelete,
  onApply,
}) => [
  {
    header: "Title",
    accessor: "title",
    cell: (row) => (
      <div className="">
        <p className="font-medium">{row.title}</p>
        <p className="text-xs text-gray-500 sm:hidden">
          {row.company}
        </p>
      </div>
    ),
  },

  {
    header: "Company",
    accessor: "company",
    className: "hidden sm:table-cell whitespace-nowrap",
  },

  {
    header: "Job Type",
    accessor: "jobType",
    className: "hidden md:table-cell whitespace-nowrap",
    cell: (row) => (
      <span className="inline-flex whitespace-nowrap px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
        {row.jobType}
      </span>
    ),
  },

  {
    header: "Experience",
    accessor: "experience",
    className: "hidden lg:table-cell whitespace-nowrap",
    cell: (row) => row.experience || "-",
  },

  {
    header: "Location",
    accessor: "location",
    className: "hidden lg:table-cell whitespace-nowrap",
  },
{
  header: "Created By",
  accessor: "createdBy",
  className: "hidden xl:table-cell whitespace-nowrap",
  cell: (row) => row.createdBy?.name || "-",
},

  {
    header: "Status",
    accessor: "isApproved",
    className: "whitespace-nowrap",
    cell: (row) => (
      <span
        className={`inline-flex whitespace-nowrap px-3 py-1 text-xs font-medium rounded-full ${
          row.isApproved
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {row.isApproved ? "Approved" : "Pending"}
      </span>
    ),
  },

  {
    header: "Actions",
    accessor: "actions",
    className: "whitespace-nowrap",
    cell: (row) => (
      <Actions
        row={row}
        onView={onView}
        onApprove={!row.isApproved ? onApprove : null}
        onDelete={onDelete}
        onApply={onApply}
      />
    ),
  },
];

export default jobColumns;
