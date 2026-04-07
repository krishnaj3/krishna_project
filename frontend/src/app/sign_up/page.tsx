'use client'

import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,20}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,30}$/;

    const handleSubmit = async (formData: FormData) => {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            toast.error("All fields are required");
            return;
        }

        if (name.length < 3 || name.length > 30) {
            toast.error("Name must be between 3 and 30 characters");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password must be 6-20 characters long, include 1 uppercase letter and 1 symbol");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, {
                name,
                email,
                password,
            });

            if (res.status === 201 || res.status === 200) {
                toast.success("Account created successfully");
                router.push("/");
            }
        } catch (error: any) {
            let errorMessage = error?.response?.data?.message || "Signup failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden py-12">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-md shadow-[0_20px_50px_rgba(28,52,88,0.05)] relative z-10 mx-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-brand-blue tracking-tight">Create Account</h1>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleSubmit(formData);
                    }}
                    className="flex flex-col gap-5"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-blue uppercase tracking-wider ml-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="e.g. Krish Jagtap"
                            required
                            className="border border-gray-200 bg-gray-50/50 p-4 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all duration-200 font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-blue uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="e.g. krish@example.com"
                            required
                            className="border border-gray-200 bg-gray-50/50 p-4 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all duration-200 font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-blue uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-200 bg-gray-50/50 p-4 rounded-md outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all duration-200 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
                            >
                                {showPassword ? (
                                    <EyeClosed className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="mt-4 bg-brand-blue text-white py-4 rounded-md font-bold hover:bg-brand-blue-light active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-blue/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-gray-500 mt-8">
                    Already have an account? <Link href={"/"} className="text-brand-blue font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </main>
    );
}