// app/organization/departments/[id]/layout.tsx
import { ReactNode } from "react"

export default function DepartmentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">Department Details</h1>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
