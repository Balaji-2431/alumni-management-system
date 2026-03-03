import React from 'react'
import { FaHandPaper } from "react-icons/fa";

const AlumniDashboardHeader = ({alumni}) => {
  return (
    <div className="capitalize bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
            Welcome, {alumni.name}
        <FaHandPaper className="text-amber-500" />
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
            Register No: {alumni.registerNumber}
        </p>
        <p className="uppercase text-gray-600 mt-1 text-sm">
            {alumni.department} ({alumni.batch})
        </p>

        <p className="mt-2 text-sm">
            Approved By:{" "}
            <span className="font-semibold">
            {alumni.approvedBy}
            </span>
        </p>
    </div> 
  )
}

export default AlumniDashboardHeader