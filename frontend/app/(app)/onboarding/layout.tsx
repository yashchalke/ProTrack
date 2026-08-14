import { ReactNode } from 'react'
import { TabNav } from './TabNav'
import { InvitationCountProvider } from '@/components/onboarding/InvitationCountContext'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <InvitationCountProvider initialCount={3}>
      <div className='w-full min-h-screen flex flex-col items-center justify-center px-100 py-30 bg-gray-100'>
        <div className='w-full min-h-150 border border-black/20 rounded-xl p-4 bg-white'>
          <div className='text-center mb-5'>
            <h1 className='text-black text-2xl font-semibold'>ProTrack</h1>
            <p className='text-gray-500 text-sm'>Welcome to ProTrack, your project management solution.</p>
          </div>
          
          <TabNav />
          
          <div className='mt-6'>
            {children}
          </div>
        </div>
      </div>
    </InvitationCountProvider>
  )
}