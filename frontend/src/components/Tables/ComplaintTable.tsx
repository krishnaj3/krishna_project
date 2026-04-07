'use client'

import { BASE_URL } from '@/constants/constant'
import { Complaint, ComplaintStatus } from '@/types/Complaint'
import { User } from '@/types/User'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'



const statusStyles: any = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    working: 'bg-blue-50 text-blue-600 border-blue-100',
    resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    failed: 'bg-rose-50 text-rose-600 border-rose-100',
}

const ComplaintTable = ({ refetch, resetRefetch }: { refetch: boolean, resetRefetch: () => void }) => {
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<Complaint | null>(null)
    const [form, setForm] = useState<Complaint | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(JSON.parse(user))
        }
        getComplaints()
    }, [])

    useEffect(() => {
        if (refetch) {
            getComplaints()
            resetRefetch()
        }
    }, [refetch])

    const getComplaints = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/complaint`, {
                withCredentials: true
            })
            setComplaints(res.data?.complaints || [])
        } finally {
            setLoading(false)
        }
    }

    const openModal = (c: Complaint) => {
        setSelected(c)
        setForm(c)
    }

    const save = async () => {
        try {
            const res = await axios.patch(
                `${BASE_URL}/complaint/${selected?.id}`,
                form,
                { withCredentials: true }
            )
            if (res.status === 200) {
                toast.success("Updated successfully")
                setSelected(null)
                getComplaints()
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error updating")
        }
    }

    const deleteComplaint = async (id: string) => {
        try {
            const res = await axios.delete(`${BASE_URL}/complaint/${id}`, {
                withCredentials: true
            })
            if (res.status === 200) {
                toast.success("Deleted successfully")
                getComplaints()
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
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {complaints.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-center" colSpan={4}>
                                        <span className="text-sm font-semibold text-gray-600">No complaints found</span>
                                    </td>
                                </tr>
                            )}
                            {complaints.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900 tracking-tight">{c.title}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">{c.description}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusStyles[c.status]}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openModal(c)}
                                            className="text-xs font-bold text-brand-blue hover:text-brand-blue-light transition-all"
                                        >
                                            View Details
                                        </button>
                                        {
                                            currentUser?.role === "user" && c.status === "pending" && <button onClick={() => {
                                                if (confirm("Are you sure you want to delete this complaint?")) {
                                                    deleteComplaint(c.id)
                                                }
                                            }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-all ml-5">Delete</button>
                                        }
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
                title="Edit Complaint"
                footer={
                    <>
                        {((currentUser?.role === 'user' && selected?.status === "pending") || currentUser?.role === 'admin') && <>
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
                        </>}
                    </>
                }
            >
                <div className="space-y-4">

                    {currentUser?.role === 'user' && form && (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Title</label>
                                <input
                                    disabled={form?.status !== "pending"}
                                    value={form?.title ?? ''}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="disabled:bg-gray-100 w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Description</label>
                                <textarea
                                    rows={3}
                                    disabled={form?.status !== "pending"}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="disabled:bg-gray-100 w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1.5 flex flex-col justify-start items-start gap-4">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-xs font-semibold text-gray-500">CURRENT STATUS</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusStyles[form.status]}`}>
                                        {form.status}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-xs font-semibold text-gray-500 ">RESPONSE</label>
                                    <span className="text-sm text-gray-700">{form.response || "-"}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {currentUser?.role === 'admin' && form && (
                        <>
                            <div className="space-y-1.5 flex flex-col justify-start items-start gap-4">
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-xs font-semibold text-gray-500">TITLE</label>
                                    <span className="text-sm text-gray-700">{form.title}</span>

                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-xs font-semibold text-gray-500 ">DESCRIPTION</label>
                                    <span className="text-sm text-gray-700">{form.description}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => {
                                        if (e.target.value === 'resolved' || e.target.value === 'failed') {
                                            setForm({ ...form, status: e.target.value as ComplaintStatus })
                                        } else {
                                            setForm({ ...form, status: e.target.value as ComplaintStatus, response: null })
                                        }
                                    }}
                                    className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-bold text-xs appearance-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="working">Working</option>
                                    <option value="failed">Failed</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Resolution Response</label>
                                <textarea
                                    rows={3}
                                    value={form?.response ?? ''}
                                    disabled={form.status !== 'resolved' && form.status !== 'failed'}
                                    onChange={(e) => setForm({ ...form, response: e.target.value })}
                                    className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium disabled:opacity-50"
                                    placeholder="Final outcome details..."
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal >
        </div >
    )
}

export default ComplaintTable