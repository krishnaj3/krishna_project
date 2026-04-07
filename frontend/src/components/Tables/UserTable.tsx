'use client'

import { BASE_URL } from '@/constants/constant'
import { User } from '@/types/User'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'
import { Edit2, Trash2 } from 'lucide-react'

const statusStyles: any = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    inactive: 'bg-rose-50 text-rose-600 border-rose-100',
}

const UserTable = ({ refetch, resetRefetch }: { refetch: boolean, resetRefetch: () => void }) => {
    const [usersList, setUsersList] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<User | null>(null)
    const [form, setForm] = useState<User | null>(null)

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        if (refetch) {
            getUsers()
            resetRefetch()
        }
    }, [refetch])

    const getUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/user`, {
                withCredentials: true
            })
            setUsersList(res.data?.users || [])
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error fetching users")
        } finally {
            setLoading(false)
        }
    }

    const openModal = (u: User) => {
        setSelected(u)
        setForm({ ...u })
    }

    const save = async () => {
        if (!form) return
        try {
            const res = await axios.patch(
                `${BASE_URL}/user/${selected?.id}`,
                { name: form.name, status: form.status },
                { withCredentials: true }
            )
            if (res.status === 200) {
                toast.success("User updated")
                setSelected(null)
                getUsers()
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error updating")
        }
    }

    const deleteUser = async (id: string) => {
        try {
            const res = await axios.delete(`${BASE_URL}/user/${id}`, {
                withCredentials: true
            })
            if (res.status === 200) {
                toast.success("User deleted")
                getUsers()
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error deleting")
        }
    }

    return (
        <div className="w-full">
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usersList.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-center" colSpan={5}>
                                        <span className="text-sm font-semibold text-gray-600">No users found</span>
                                    </td>
                                </tr>
                            )}
                            {usersList.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900 tracking-tight">{u.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusStyles[u.status]}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => openModal(u)}
                                                className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-md transition-all"
                                                title="Edit User"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete ${u.name}?`)) {
                                                        deleteUser(u.id)
                                                    }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                title="Edit User"
                footer={
                    <>
                        <button
                            onClick={() => setSelected(null)}
                            className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={save}
                            className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-blue-light transition-all shadow-sm"
                        >
                            Save Changes
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Full Name</label>
                        <input
                            value={form?.name ?? ''}
                            onChange={(e) => setForm(form ? { ...form, name: e.target.value } : null)}
                            className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Status</label>
                        <select
                            value={form?.status ?? 'active'}
                            onChange={(e) => setForm(form ? { ...form, status: e.target.value as "active" | "inactive" } : null)}
                            className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-bold text-xs appearance-none"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</span>
                        <span className="text-xs font-medium text-gray-600">{form?.email}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Role</span>
                        <span className="text-xs font-bold text-brand-blue uppercase">{form?.role}</span>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UserTable
