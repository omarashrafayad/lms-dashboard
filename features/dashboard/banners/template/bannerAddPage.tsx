"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bannerSchema, BannerFormData } from "../schema/banner.schema"
import { useCreateBanner } from "../hooks/useBanners"
import { Form } from "@/components/ui/form"
import { UniInput } from "@/components/shared/UniInput"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { UploadCloud, X, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function BannerAddPage() {
  const router = useRouter()
  const createMutation = useCreateBanner()
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

  const onSubmit = async (values: BannerFormData) => {
    try {
      const formData = new FormData()
      formData.append("Title", values.title.trim())
      formData.append("LinkUrl", values.linkUrl ? values.linkUrl.trim() : "")
      formData.append("Order", String(values.order ?? 0))
      formData.append("IsActive", String(values.isActive ?? true))
      if (selectedFile) {
        formData.append("image", selectedFile)
      }

      await createMutation.mutateAsync(formData)
      toast.success("Banner created successfully!")
      router.push("/banners")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Add New Banner"
        description="Upload a new promotional banner graphic for the student portal."
      />

      <main className="flex-1 p-8 flex flex-col gap-6 max-w-4xl w-full mx-auto pb-20">
        <div className="flex items-center gap-2">
          <Link
            href="/banners"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to all banners</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Banner Graphic Area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-700">
                  Banner Graphic Image *
                </label>

                {previewUrl ? (
                  <div className="relative w-full h-56 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 group">
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
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-44 rounded-xl border-2 border-dashed border-zinc-200 hover:border-brand-orange bg-zinc-50/60 hover:bg-amber-50/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4"
                  >
                    <div className="size-11 rounded-full bg-white shadow-2xs border border-zinc-200/80 flex items-center justify-center text-zinc-500">
                      <UploadCloud className="size-5 text-brand-orange" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold text-zinc-700 block">
                        Click to select banner graphic
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Recommended size: 1200 x 400px (PNG, JPG, WebP)
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

              {/* Title */}
              <UniInput
                control={form.control}
                name="title"
                label="Banner Title *"
                placeholder="e.g. Back to School Discounts"
              />

              {/* Link URL */}
              <UniInput
                control={form.control}
                name="linkUrl"
                label="Destination Link (Optional)"
                placeholder="e.g. https://... or /academic/courses"
                helperText="Link URL opened when clicking the banner"
              />

              {/* Order */}
              <UniInput
                control={form.control}
                name="order"
                label="Display Order"
                type="number"
                placeholder="0"
                min={0}
                helperText="Order priority in banner slider (0 is highest)"
              />

              {/* Active Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    Active & Published
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Immediately show this banner on the student portal
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.watch("isActive")}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="size-4.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange cursor-pointer accent-[#D97706]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/banners")}
                  disabled={createMutation.isPending}
                  className="rounded-xl text-xs h-10 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-xl text-xs h-10 px-5 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
                >
                  {createMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    "Save & Publish Banner"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}

