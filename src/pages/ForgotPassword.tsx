import { useState } from "react"
import { forgotPassword } from "../services/auth"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      setLoading(true)
      const res = await forgotPassword(email)
      setMessage(res.message)
    } catch (err: any) {
      setMessage("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center px-4">
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-slate-900 p-6 rounded-lg w-96">
                <h1 className="text-xl mb-4">Forgot Password</h1>

                <input
                className="w-full p-2 mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-indigo-600 p-2"
                >
                {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {message && <p className="text-green-400 mt-3">{message}</p>}
            </div>
        </div>
    </div>
    
  )
}
