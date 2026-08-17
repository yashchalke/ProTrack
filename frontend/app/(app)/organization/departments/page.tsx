import DepartmentHomeCard from '@/components/Organization/Departments/DepartmentHomeCard'
import React from 'react'

const page = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
        <DepartmentHomeCard />
    </div>
  )
}

export default page