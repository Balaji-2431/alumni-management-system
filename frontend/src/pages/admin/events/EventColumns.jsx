import Actions from "../../../components/admin/Actions";
import { formatDate } from "../../../utils/formatDate";

const eventColumns = ({
  onView,
  onApprove,
  onDelete,
}) => [
  /* ================= TITLE (ALWAYS) ================= */
  {
    header: "Title",
    accessor: "title",
    cell: (row) => (
      <div className="">
        <p className="font-medium">{row.title}</p>
        <p className="text-xs text-gray-500 lg:hidden">
          {formatDate(row.date)}
        </p>
      </div>
    ),
  },


  /* ================= DATE (SM+) ================= */
  {
    header: "Date",
    accessor: "date",
    className: "hidden lg:table-cell whitespace-nowrap",
    cell: (row) =>
      formatDate(row.date),
  },

  /* ================= CATEGORY (MD+) ================= */
  {
    header: "Category",
    accessor: "category",
    className: "hidden md:table-cell whitespace-nowrap capitalize",
  },

  /* ================= ORGANIZER (MD+) ================= */
  {
    header: "Organizer",
    accessor: "organizerName",
    className: "hidden sm:table-cell whitespace-nowrap",
    cell: (row) => row.organizerName || "—",
  },

  /* ================= MODE (LG+) ================= */
  {
    header: "Mode",
    accessor: "mode",
    className: "hidden lg:table-cell whitespace-nowrap capitalize",
  },
  {
    header: "Created By",
    accessor: "createdBy",
    className: "hidden xl:table-cell whitespace-nowrap",
    cell: (row) => row.createdBy?.name || "-",
  },

  /* ================= STATUS (ALWAYS) ================= */
  // {
  //   header: "Status",
  //   accessor: "isApproved",
  //   className: "whitespace-nowrap",
  //   cell: (row) => (
  //     <StatusBadge
  //       status={row.isApproved ? "approved" : "pending"}
  //     />
  //   ),
  // },
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
  /* ================= ACTIONS (ALWAYS) ================= */
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
      />
    ),
  },
];

export default eventColumns;
