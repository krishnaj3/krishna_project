'use client'

import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard/complaints");
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const username = formData.get("username");
      const password = formData.get("password");
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: username,
        password,
      }, {
        withCredentials: true
      })

      if (res.status === 200) {
        const data = res.data?.user

        if (data) {
          toast.success("Login successful");
          localStorage.setItem("user", JSON.stringify(data));
          router.push("/dashboard/complaints");
        } else {
          toast.error("Login failed");
        }
      }
    } catch (error: any) {
      let errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-md shadow-[0_20px_50px_rgba(28,52,88,0.05)] relative z-10 mx-4">
        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold text-brand-blue tracking-tight">Welcome back</h1>

        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-blue uppercase tracking-wider ml-1">Email / Username</label>
            <input
              name="username"
              type="text"
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
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          Don’t have an account? <Link href={"/sign_up"} className="text-brand-blue font-bold hover:underline">Create account</Link>
        </p>
      </div>
    </main>
  );
}