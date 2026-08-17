import React, { ReactNode } from 'react'
import Sidebar from '@/components/Global/Sidebar'

const Global_layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex'>
        <div>
            <Sidebar />
        </div>
        <div className='w-full bg-amber-50/40'>
            <div className='w-full h-15'>

            </div>
        <div className='w-full'>
            {children}
        </div>
        </div>
    </div>
  )
}

export default Global_layout