'use client'

import { Dialog } from '@headlessui/react'
import React from 'react'

type ModalProps = {
    open: boolean
    onClose: () => void
    title?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
    width?: string
}

const Modal = ({
    open,
    onClose,
    title,
    children,
    footer,
    width = 'max-w-lg'
}: ModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className={`w-full ${width} bg-white border border-gray-200 rounded-xl flex flex-col`}
                >
                    {title && (
                        <div className="px-5 py-4 border-b border-gray-200">
                            <Dialog.Title className="text-base font-semibold">
                                {title}
                            </Dialog.Title>
                        </div>
                    )}
                    <div className="px-5 py-4 text-sm text-gray-700">
                        {children}
                    </div>
                    {footer && (
                        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default Modal