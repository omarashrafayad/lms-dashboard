"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

export interface ReferenceDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemToEdit?: { id: string; name: string; isActive?: boolean } | null
  entityName: string
  onSubmit: (data: { name: string; isActive: boolean }) => Promise<void> | void
  isSubmitting?: boolean
}

export function ReferenceDataModal({
  open,
  onOpenChange,
  itemToEdit,
  entityName,
  onSubmit,
  isSubmitting = false,
}: ReferenceDataModalProps) {
  const isEdit = !!itemToEdit
  const [name, setName] = React.useState("")
  const [isActive, setIsActive] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (open) {
      if (itemToEdit) {
        setName(itemToEdit.name || "")
        setIsActive(itemToEdit.isActive ?? true)
      } else {
        setName("")
        setIsActive(true)
      }
      setError("")
    }
  }, [open, itemToEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError(`${entityName} name is required`)
      return
    }
    setError("")
    await onSubmit({
      name: name.trim(),
      isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${entityName}` : `Add New ${entityName}`}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update details and status for this ${entityName.toLowerCase()}.`
              : `Create a new ${entityName.toLowerCase()} record in the system.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              {entityName} Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError("")
              }}
              placeholder={`e.g. Primary, Secondary...`}
              className="h-10 px-3 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm focus-visible:ring-brand-orange/20 focus-visible:border-brand-orange transition-all"
            />
            {error && (
              <span className="text-xs text-red-500 font-medium">{error}</span>
            )}
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-zinc-800">
                Active Status
              </span>
              <span className="text-[11px] text-zinc-500">
                {isActive
                  ? "Record is active and available in forms"
                  : "Record is hidden and inactive"}
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#F59E0B] hover:bg-amber-500 text-white text-xs font-semibold px-4 cursor-pointer shadow-2xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                `Add ${entityName}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
