import OrgNavbar from '@/components/Organization/OrgNavbar'
import React from 'react'

const Organizationlayout = ({children}:{children:React.ReactNode}) => {
    
  return (
    <div className='p-6 w-full flex flex-col gap-4'>
        <div>
            <h1 className='text-3xl font-semibold'>Organization</h1>
        </div>
        <div className='w-full'>
            <OrgNavbar />
        </div>
    <div>
        {children}
    </div>
    </div>
  )
}

export default Organizationlayout