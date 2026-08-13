
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-white'>
      <div className='flex flex-col items-center gap-y-4'>
        <h1 className='text-4xl font-semibold text-black'>ProTrack</h1>
        <Link href={'/signup'} className='bg-blue-600 py-2 px-4 rounded'>Try now</Link>
        
      </div>
    </div>
  )
}

export default page