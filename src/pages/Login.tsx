import { useState } from "react"
import { Moon, Eye, EyeOff, Sparkles } from "lucide-react"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import { getMyDetails, login } from "../services/auth"
import Swal from "sweetalert2"

export default function Login() {
   const [email, setUsername] = useState("")
   const [password, setPassword] = useState("")
   const [showPassword, setShowPassword] = useState(false)

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e:React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Something Went Wrong",
                text: "Please enter both username and password.",
                confirmButtonColor: "#f87171"
            })
            return
        }

        try {
            const data: any = await login(email, password)

            if (data?.data?.accessToken) {
                localStorage.setItem("accessToken", data.data.accessToken)
                if (data.data.refreshToken) {
                  localStorage.setItem("refreshToken", data.data.refreshToken)
                }

                const resData = await getMyDetails()
                setUser(resData.data)

                const role = resData.data.roles?.[0]
                if (role === "AUTHOR") {
                    navigate("/author/home")
                } 
                else if (role === "ADMIN") {
                    navigate("/admin/home")
                } 
                else {
                    navigate("/user/home")
                }

            } else{
                Swal.fire({
                    icon: "error",
                    title: "Login failed",
                    text: "Please check your credentials!",
                    confirmButtonColor: "#7c3aed"
                })
            }
        } catch (error) {
            console.error("Login Error", error)
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: "Please check your credentials!",
                confirmButtonColor: "#7c3aed"
            })
        }
    }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
         <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
                <Moon className="w-10 h-10 text-yellow-400" />
                <span className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                MoonPages
                </span>
            </a>
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-950/50 border border-indigo-800/30 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Welcome back</span>
                </div>
            </div>
        </div>
        

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-center">Sign In</h1>
          <p className="text-slate-400 text-center mb-8">
            Continue your reading journey
          </p>

          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-400">
                New to MoonPages?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-slate-400 hover:text-slate-300 transition"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}