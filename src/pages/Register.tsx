import { register, getMyDetails } from "../services/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Moon, Eye, EyeOff, User as UserIcon, BookOpen, type LucideIcon } from "lucide-react"

interface RoleOptionProps {
    value: string
    label: string
    Icon: LucideIcon
}

interface RoleOptionItem {
    value: string
    label: string
    Icon: LucideIcon
}

function Register() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("USER")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    console.log("Registered:", { firstName, lastName, email, password, role })

    try {
      const data: any = await register(firstName, lastName, email, password, role)
      console.log("Register response:", data)

      const token = data?.data?.accessToken || data?.accessToken

      if (token) {
        await localStorage.setItem("accessToken", token)

        const resData = await getMyDetails()
        console.log(resData)
        console.log("User Registered successfully")

        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created successfully.",
          confirmButtonColor: "#7c3aed",
        })

        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")

        navigate("/login")

      } else {
        Swal.fire({
          icon: "warning",
          title: "Something Went Wrong",
          text: "User registered but no access token was received.",
          confirmButtonColor: "#f87171",
        })
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "An error occurred during registration. Please try again.",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const RoleOption = ({ value, label, Icon }: RoleOptionProps) => ( 
    <label 
      className={`flex-1 flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition 
        ${role === value 
          ? 'bg-indigo-700/50 border-indigo-500 shadow-lg ring-2 ring-indigo-500' 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
        } text-white`} 
    >
      <input
        type="radio"
        name="role"
        value={value}
        checked={role === value}
        onChange={() => setRole(value)}
        className="form-radio text-indigo-500 h-4 w-4 bg-transparent border-slate-500 focus:ring-indigo-500"
      />
      {Icon && <Icon className="w-5 h-5" />} 
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </label>
  )

  const roleOptions: RoleOptionItem[] = [
    { value: "USER", label: "Reader", Icon: UserIcon },
    { value: "AUTHOR", label: "Writer", Icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-0 text-center">
            <a href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
                <Moon className="w-10 h-10 text-yellow-400" />
                <span className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                MoonPages
                </span>
            </a>
        </div>

        {/* Register card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold mb-2 text-center">Create Your Account</h1>
            <p className="text-slate-400 text-center mb-8">
                Start your reading journey with MoonPages
            </p>

            <div className="space-y-6">
                {/* FirstName */}
                <div>
                <label htmlFor="firstname" className="block text-sm font-medium mb-2 text-slate-300">
                    FirstName
                </label>
                <input
                    id="firstname"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
                />
                </div>
                {/* LastName */}
                <div>
                <label htmlFor="lastname" className="block text-sm font-medium mb-2 text-slate-300">
                    LastName
                </label>
                <input
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
                />
                </div>
                {/* Email */}
                <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
                />
                </div>
                {/* Password */}
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

                {/* --- Role Selection Integration --- */}
                <div className="space-y-2 pt-2">
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                        Select Role
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Ensure we map over the typed roleOptions array */}
                        {roleOptions.map((roleItem: RoleOptionItem) => (
                            <RoleOption
                                key={roleItem.value}
                                value={roleItem.value}
                                label={roleItem.label}
                                Icon={roleItem.Icon}
                            />
                        ))}
                    </div>
                </div>

                {/* Register Button */}
                <button
                    onClick={handleSubmit}
                    className="mb-1 w-full px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition transform hover:scale-105 shadow-lg"
                    >
                    Register
                </button>

                <p className="text-sm text-center text-gray-300 mt-0">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
                    >
                        Login
                    </Link>
                </p>

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
      </div>

      
    </div>
  )
}

export default Register