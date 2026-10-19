"use client"

import * as React from "react"
import { User, Camera, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProfileSettings } from "../../types/settings.types"
import { toast } from "sonner"

interface ProfileSettingsTabProps {
  settings: ProfileSettings
  onChange: (updated: Partial<ProfileSettings>) => void
}

export function ProfileSettingsTab({
  settings,
  onChange,
}: ProfileSettingsTabProps) {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdatingPassword(true)
    setTimeout(() => {
      setIsUpdatingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated successfully!")
    }, 600)
  }

  const handleAvatarChange = () => {
    toast.info("Upload avatar dialog triggered (Mock action)")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Overview & Avatar Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-brand-orange">
            <User className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Admin Personal Profile
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Manage your personal administrative identity, contact info, and profile portrait.
            </p>
          </div>
        </div>

        {/* Avatar Upload Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-zinc-100">
          <div className="relative group shrink-0">
            <div className="size-24 rounded-full overflow-hidden border-2 border-zinc-200 shadow-sm">
              <img
                src={settings.avatarUrl || "/dina-farouk.jpg"}
                alt={settings.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleAvatarChange}
              title="Change portrait"
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <span className="text-sm font-bold text-zinc-900">
                {settings.fullName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                {settings.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Allowed JPG, PNG or WEBP. Maximum file size is 2MB. Recommended dimensions 400x400px.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarChange}
                className="h-8 px-3 rounded-lg text-xs font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Change Photo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange({ avatarUrl: "" })
                  toast.info("Avatar reset to default")
                }}
                className="h-8 px-3 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={settings.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Dina Farouk"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Personal Account Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="admin@innovation-lms.com"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Phone Number
            </label>
            <Input
              type="text"
              value={settings.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+20 112 345 6789"
              className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
            />
          </div>

          {/* Role (Read only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Assigned Role
            </label>
            <Input
              type="text"
              readOnly
              value={settings.role}
              className="h-10 px-3.5 rounded-xl border border-zinc-200/70 bg-zinc-50 text-xs text-zinc-500 cursor-not-allowed select-none"
            />
            <span className="text-[11px] text-zinc-400">
              Role permissions are managed in System Governance.
            </span>
          </div>

          {/* Bio / Description */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700">
              Short Administrator Bio / Responsibilities
            </label>
            <textarea
              rows={3}
              value={settings.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              placeholder="Brief description of administrative duties..."
              className="w-full p-3 rounded-xl border border-zinc-200/90 bg-white text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none"
            />
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-2xs">
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-100">
          <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-700">
            <Lock className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Change Password
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ensure your account maintains a strong security standard with a unique passphrase.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 pt-5 max-w-xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter existing password"
                className="h-10 px-3.5 pr-10 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Confirm New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="h-10 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-2xs cursor-pointer gap-2"
            >
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>{isUpdatingPassword ? "Updating..." : "Update Password"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
