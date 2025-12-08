import { useState, useEffect } from "react"
import { Moon, User, Mail, Shield, Camera, Trash2, Save, ArrowLeft } from "lucide-react"
import { useAuth } from "../../context/authContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { updateUserDetails, uploadProfilePicture, deleteUserAccount } from "../../services/user"

export default function AuthorSettings() {
  const { user, setUser, loading } = useAuth()    
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [, setProfilePic] = useState(user?.profilePic || "")
  const [previewImage, setPreviewImage] = useState(user?.profilePic || "")

  useEffect(() => {
    if (user) {
        console.log("UserSettings received updated user, populating form.", user)

        setFirstName(user.firstName || "")
        setLastName(user.lastName || "")
        setEmail(user.email || "")
        setProfilePic(user.profilePic || "")
        setPreviewImage(user.profilePic || "")
    }
  }, [user])

  if (loading) {
    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <p className="text-xl text-indigo-400 animate-pulse">Loading Profile Data...</p>
        </div>
    )
  }

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#7c3aed"
      })
      return
    }

    try {
      const updatedUserData = await updateUserDetails({ firstName, lastName, email })

      setUser(updatedUserData)

      Swal.fire({
        icon: "success",
        title: "Settings Updated",
        text: "Your profile has been updated successfully!",
        confirmButtonColor: "#7c3aed"
      })
    } catch (error) {
      console.error("Update Error", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update your profile. Please try again.",
        confirmButtonColor: "#f87171"
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      handleProfileUpload(file)
    }
  }

  const handleProfileUpload = async (file: File) => {
    try {
        const updatedUserData = await uploadProfilePicture(file)

        setUser(updatedUserData)

        Swal.fire({
            icon: "success",
            title: "Photo Updated",
            text: "Your profile picture has been updated successfully!",
            confirmButtonColor: "#7c3aed"
        })
    } catch (error) {
        console.error("Upload Error", error)

        setPreviewImage(user?.profilePic || "")

        Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Could not upload profile picture. Please try again.",
            confirmButtonColor: "#7c3aed"
        })
    }
  }

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone. All your data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel"
    })

    if (result.isConfirmed) {
      try {
        await deleteUserAccount()

        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)

        Swal.fire({
          icon: "success",
          title: "Deletion Success",
          text: "Your Account is deleted successfully!",
          confirmButtonColor: "#f87171"
        }).then(() =>{
            navigate("/")
        })

      } catch (error) {
        console.error("Delete Error", error)
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: "Could not delete your account. Please try again.",
          confirmButtonColor: "#f87171"
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-indigo-950 to-slate-950 text-white px-4 py-8">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-slate-400 mt-1">Manage your profile and preferences</p>
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-2">
            <Moon className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              MoonPages
            </span>
          </a>
        </div>

        {/* Settings Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-700">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-indigo-600/50 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-500 transition shadow-lg"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-slate-400 text-sm mt-4">Click the camera icon to upload a new photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-slate-300">
                <User className="w-4 h-4 inline mr-2" />
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-slate-300">
                <User className="w-4 h-4 inline mr-2" />
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2 text-slate-300">
                <Shield className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <input
                id="role"
                type="text"
                value={user?.roles?.[0] || "USER"}
                disabled
                className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Your role cannot be changed</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveChanges}
              className="w-full px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


