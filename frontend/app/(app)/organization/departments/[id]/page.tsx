import React from 'react'

const page = () => {
  return (
    <div>
      <div className='flex justify-end gap-x-2'>
        <button className='bg-orange-500 px-4 py-2 rounded-md text-white text-sm font-medium'> + Add Employee </button>
        <button className='bg-orange-500 px-4 py-2 rounded-md text-white text-sm font-medium'> + Create Team</button>
      </div>
      <div className='mt-2 flex flex-col gap-y-2'>
        <div className='bg-orange-500 text-white p-2 rounded '>
          <h1>Teams</h1>
        </div>
        <div className='bg-orange-500 text-white p-2 rounded '>
          <h1>Employees</h1>
        </div>
      </div>
    </div>
  )
}

export default page