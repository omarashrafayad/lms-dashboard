"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { Banner } from "../types/banner.types"
import { bannerSchema, BannerFormData } from "../schema/banner.schema"
import { Image as ImageIcon, UploadCloud, X, Loader2 } from "lucide-react"

export interface BannerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: Banner | null
  onSubmit: (data: FormData) => Promise<void>
  isSubmitting?: boolean
}

export function BannerFormModal({
  open,
  onOpenChange,
  banner,
  onSubmit,
  isSubmitting = false,
}: BannerFormModalProps) {
  const isEditing = Boolean(banner)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema) as any,
    defaultValues: {
      title: "",
      linkUrl: "",
      order: 0,
      isActive: true,
    },
  })

  React.useEffect(() => {
    if (open) {
      if (banner) {
        form.reset({
          title: banner.title || "",
          linkUrl: banner.linkUrl || "",
          order: banner.order ?? 0,
          isActive: banner.isActive ?? true,
        })
        if (banner.imageUrl) {
          const url =
            banner.imageUrl.startsWith("http://") || banner.imageUrl.startsWith("https://")
              ? banner.imageUrl
              : `https://lmssiteapi.runasp.net${banner.imageUrl.startsWith("/") ? "" : "/"}${banner.imageUrl}`
          setPreviewUrl(url)
        } else {
          setPreviewUrl(
            `https://lmssiteapi.runasp.net/api/v1/content/banners/${banner.id}/image`
          )
        }
      } else {
        form.reset({
          title: "",
          linkUrl: "",
          order: 0,
          isActive: true,
        })
        setPreviewUrl(null)
      }
      setSelectedFile(null)
    }
  }, [open, banner, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFormSubmit = async (values: BannerFormData) => {
    const formData = new FormData()
    formData.append("Title", values.title.trim())
    formData.append("LinkUrl", values.linkUrl ? values.linkUrl.trim() : "")
    formData.append("Order", String(values.order ?? 0))
    formData.append("IsActive", String(values.isActive ?? true))

    if (selectedFile) {
      formData.append("image", selectedFile)
    }

    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
              <ImageIcon className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900">
                {isEditing ? "Edit Banner" : "Create New Banner"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {isEditing
                  ? "Update banner details, ordering, or replace the graphic."
                  : "Upload a new promotional banner with optional link and display order."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
            {/* Title */}
            <UniInput
              control={form.control}
              name="title"
              label="Banner Title *"
              placeholder="e.g. Summer School Special Offer 50% Off"
            />

            {/* Link URL */}
            <UniInput
              control={form.control}
              name="linkUrl"
              label="Destination Link (Optional)"
              placeholder="e.g. https://... or /academic/courses"
              helperText="URL where users will be redirected when clicking the banner"
            />

            {/* Display Order */}
            <UniInput
              control={form.control}
              name="order"
              label="Display Order"
              type="number"
              placeholder="0"
              min={0}
              helperText="Lower numbers appear first in the banner carousel"
            />

            {/* Image Upload Area */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-700">
                Banner Graphic {isEditing ? "(Leave unchanged to keep current)" : "*"}
              </label>

              {previewUrl ? (
                <div className="relative w-full h-44 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-xs font-semibold text-zinc-900 transition-colors cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-zinc-200 hover:border-brand-orange bg-zinc-50/60 hover:bg-amber-50/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4"
                >
                  <div className="size-10 rounded-full bg-white shadow-2xs border border-zinc-200/80 flex items-center justify-center text-zinc-500">
                    <UploadCloud className="size-5 text-brand-orange" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-zinc-700 block">
                      Click to upload banner image
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      PNG, JPG, or WebP (recommended 1200x400px)
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">
                  Visible to Students
                </span>
                <span className="text-[11px] text-zinc-500">
                  Active banners will be rendered in the student portal homepage
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.watch("isActive")}
                onChange={(e) => form.setValue("isActive", e.target.checked)}
                className="size-4.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange cursor-pointer accent-[#D97706]"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-100 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : isEditing ? (
                  "Update Banner"
                ) : (
                  "Create Banner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

