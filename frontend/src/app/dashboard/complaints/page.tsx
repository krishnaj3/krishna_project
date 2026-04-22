'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ComplaintTable from '@/components/Tables/ComplaintTable'
import Modal from '@/components/Modal'
import toast from 'react-hot-toast'
import { BASE_URL } from '@/constants/constant'
import { Plus } from 'lucide-react'

const Page = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [refetch, setRefetch] = useState(false)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        try {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role !== "admin") {
                setHasAccess(true);
            }
        }
        } catch{}
    },[])

    const handleSubmit = async () => {
        if (!title || !description) {
            toast.error("Please fill all fields")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(
                `${BASE_URL}/complaint`,
                { title, description },
                { withCredentials: true }
            )

            if (res.status === 201) {
                toast.success("Complaint submitted successfully")
                setTitle('')
                setRefetch(true)
                setDescription('')
                setOpen(false)
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error submitting complaint")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-md border border-gray-100 shadow-sm">
                <div className="space-y-0.5">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Complaints</h1>
                </div>

               {hasAccess && <button
                    onClick={() => setOpen(true)}
                    className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-brand-blue-light transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm"
                >
                    <Plus size={16} />
                    New Submission
                </button>}
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="New Complaint"
                footer={
                    <>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-blue-light transition-all disabled:opacity-70"
                        >
                            {loading ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Title</label>
                        <input
                            placeholder="Brief subject of your issue"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-0.5">Description</label>
                        <textarea
                            placeholder="Provide details about the problem"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 bg-gray-50/30 p-2.5 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium"
                            rows={4}
                        />
                    </div>
                </div>
            </Modal>

            <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                <ComplaintTable refetch={refetch} resetRefetch={() => setRefetch(false)} />
            </div>
        </div>
    )
}

export default Page