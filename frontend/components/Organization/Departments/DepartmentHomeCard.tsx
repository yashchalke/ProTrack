import { MoreVertical, Users, Network } from 'lucide-react'
import React from 'react'

const DepartmentHomeCard = ({ name,emp_count,teams_count}:{name:string,emp_count:number,teams_count:number}) => {
  return (
    <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-white via-orange-50/20 to-orange-100/30 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{name}</h2>
        <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100/50 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-x-6 text-gray-600 font-medium">
        <div className="flex items-center gap-x-2">
          <Users className="w-5 h-5 text-gray-700" />
          <span>Employees: <strong className="font-semibold text-gray-700">{emp_count}</strong></span>
        </div>
        <div className="flex items-center gap-x-2">
          <Network className="w-5 h-5 text-gray-700" />
          <span>Teams: <strong className="font-semibold text-gray-700">{teams_count}</strong></span>
        </div>
      </div>

      <div className="flex gap-x-4">
        <button className="px-4 py-2 rounded-xl text-amber-500 font-medium text-sm border border-amber-200/80 bg-white hover:bg-amber-50/50 transition-colors">
          Add Employee
        </button>
        <button className="px-4 py-2 rounded-xl text-amber-500 font-medium text-sm border border-amber-200/80 bg-white hover:bg-amber-50/50 transition-colors">
          Create Team
        </button>
      </div>
    </div>
  )
}

export default DepartmentHomeCard