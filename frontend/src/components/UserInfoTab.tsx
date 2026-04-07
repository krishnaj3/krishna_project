'use client'

import { BASE_URL } from '@/constants/constant'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const UserInfoTab = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {
                withCredentials: true
            })
            if (res.status === 200) {
                toast.success("Logged out successfully")
                localStorage.removeItem("user")
                window.location.href = "/"
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Logout failed"
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            disabled={loading}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50 transition-all border border-red-300 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <LogOut size={16} />
            {loading ? "Logging out..." : "Sign Out"}
        </button>
    )
}

export default UserInfoTab