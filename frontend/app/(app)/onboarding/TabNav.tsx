'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useInvitationCount } from '@/components/onboarding/InvitationCountContext'

const tabs = [
  { href: '/onboarding/create', label: 'Create Organization', badge: false },
  { href: '/onboarding/invitations', label: 'Invitations', badge: true },
]

export function TabNav() {
  const pathname = usePathname()
  const { pendingCount } = useInvitationCount()

  return (
    <div className='flex bg-blue-100 p-[4px] rounded'>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const showBadge = tab.badge && pendingCount > 0

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 text-center rounded p-2 transition-colors flex items-center justify-center gap-2 text-sm ${
              isActive
                ? 'bg-blue-400 font-medium text-white font-semibold shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
            {showBadge && (
              <span className='inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none'>
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
