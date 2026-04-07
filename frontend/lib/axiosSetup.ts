'use client'

import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import Swal from "sweetalert2";
if (typeof window !== "undefined") {
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const user = localStorage.getItem("user");
            if (error.response?.status === 401 && user) {
                const message = error.response?.data?.message || "You have been logged out";
                Swal.fire({
                    title: "You have been logged out",
                    text: message,
                    icon: "warning",
                    timer: 3000,
                    showConfirmButton: false
                });

                try {
                    await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
                } catch (e) {
                }

                setTimeout(() => {
                    localStorage.removeItem("user");
                    window.location.href = "/";
                }, 3000);

            } else {
                return Promise.reject(error);
            }
        }
    );
}
