import React from 'react'
import JobCard from "../../../components/alumni/jobs/JobCard";
import EventCard from "../../../components/alumni/events/EventCard"

const YourPosts = ({yourPosts}) => {
  return (
    <>
        <h2 className="text-lg font-semibold mb-4">
          Your Posts Activity
        </h2>

        { yourPosts.length === 0 ? (
          <p className="mt-5 md:mt-16 text-gray-500 text-center">No posts yet</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            { yourPosts.map((item) => (
              item.type === "job" ? (
                <JobCard key={item._id} job={item} />
              ) : (
                <EventCard key={item._id} event={item} />
              )
            ))}
        </div>
        )}
    </>
  )
}

export default YourPosts