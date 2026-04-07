'use client'

import AuthCheck from "@/components/AuthCheck";
import UserInfoTab from "@/components/UserInfoTab";
import { User } from "@/types/User";
import { Bell, BookOpen, LayoutDashboard, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);


    const navItems = [
        { name: "Complaints", href: "/dashboard/complaints", icon: MessageSquare },
        { name: "Users", href: "/dashboard/users", icon: Users },
    ];

    return (
        <AuthCheck>
            <div className="flex h-screen bg-[#FDFDFD]">
                <aside className="w-64 bg-white border-r border-gray-100 flex flex-col z-20">
                    <div className="p-6 border-b border-gray-50">
                        <div className="flex items-center gap-2">

                            <h1 className="text-lg font-bold text-brand-blue tracking-tight">
                                Complaint Management
                            </h1>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.filter((item) => {
                            if (item.name === "Users" && user?.role !== "admin") {
                                return false;
                            }
                            return true;
                        }).map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${active
                                        ? "bg-brand-blue/5 text-brand-blue"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={18} className={active ? "text-brand-blue" : "text-gray-400"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-50">
                        <UserInfoTab />
                    </div>
                </aside>

                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">



                    </header>

                    <main className="p-8 overflow-auto flex-1">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthCheck>
    );
}