'use client'

import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            axios.get(`${BASE_URL}/user/me`, {
                withCredentials: true
            }).then((res) => {
                if (res.status === 200) {
                    const data = res.data?.user
                    if (data) {
                        localStorage.setItem("user", JSON.stringify(data));
                    } else {
                        router.replace("/")
                    }
                } else {
                    router.replace("/")
                }
            }).catch((error) => {
                router.replace("/")
            })
        }
    }, [pathname]);

    return <>{children}</>;
}