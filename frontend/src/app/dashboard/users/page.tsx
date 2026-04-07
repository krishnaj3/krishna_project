'use client'

import React, { useState } from 'react'
import UserTable from '@/components/Tables/UserTable'

const Page = () => {
    const [refetch, setRefetch] = useState(false)

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm flex flex-col gap-1">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">User Management</h1>
            </div>

            <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                <UserTable refetch={refetch} resetRefetch={() => setRefetch(false)} />
            </div>
        </div>
    )
}

export default Page