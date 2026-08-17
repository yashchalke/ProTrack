import React, { ReactNode } from 'react'
import Sidebar from '@/components/Global/Sidebar'

const Global_layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex'>
        <div>
            <Sidebar />
        </div>
        <div>
            {children}
        </div>
    </div>
  )
}

export default Global_layout