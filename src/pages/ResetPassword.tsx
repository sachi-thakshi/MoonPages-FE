import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { resetPassword } from "../services/auth"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const { token } = useParams<{ token: string }>() 
  const navigate = useNavigate()

  const submit = async () => {
    if (!token) {
      setMessage("Invalid or missing token")
      return
    }

    try {
      const res = await resetPassword(token, password)
      setMessage(res.message)

      setTimeout(() => navigate("/login"), 2000)
    } catch {
      setMessage("Invalid or expired token")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-900 p-6 rounded-lg w-96">
          <h1 className="text-xl mb-4">Reset Password</h1>

          <input
            type="password"
            className="w-full p-2 mb-3"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={submit} className="w-full bg-green-600 p-2">
            Reset Password
          </button>

          {message && <p className="text-green-400 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  )
}
