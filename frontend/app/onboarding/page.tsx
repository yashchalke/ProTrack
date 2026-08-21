import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
    redirect('/onboarding/create')
}

export default page