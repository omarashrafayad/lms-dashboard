"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import { ApiStudent } from "@/features/dashboard/student/types/student.types"
import { useCreateParent } from "../hooks/useParents"
import {
  createParentSchema,
  CreateParentFormData,
} from "../schema/parent.schema"
import {
  ParentBasicInfoCard,
  ParentLinkChildrenCard,
  LinkedChildItem,
} from "../components/form"

export default function ParentAddPage() {
  const router = useRouter()
  const createParentMutation = useCreateParent()

  const [linkedChildren, setLinkedChildren] = React.useState<LinkedChildItem[]>([])

  const form = useForm<CreateParentFormData>({
    resolver: zodResolver(createParentSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      isActive: true,
      sendWelcomeEmail: true,
      childIds: [],
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form

  const handleAddChild = React.useCallback(
    (student: ApiStudent) => {
      setLinkedChildren((prev) => [
        ...prev,
        {
          id: student.id,
          name: student.fullName || "Unnamed Student",
          grade: student.grade || "—",
          stage: student.educationStage || "—",
          email: student.email || "",
        },
      ])

      const currentChildIds = getValues("childIds") ?? []
      if (!currentChildIds.includes(student.id)) {
        setValue("childIds", [...currentChildIds, student.id], {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    },
    [getValues, setValue]
  )

  const handleRemoveChild = React.useCallback(
    (id: string) => {
      setLinkedChildren((prev) => prev.filter((c) => c.id !== id))

      const currentChildIds = getValues("childIds") ?? []
      setValue(
        "childIds",
        currentChildIds.filter((childId) => childId !== id),
        { shouldDirty: true, shouldValidate: true }
      )
    },
    [getValues, setValue]
  )

  const handleCancel = React.useCallback(() => {
    router.push("/parent/parent_list")
  }, [router])

  const onSubmit = async (data: CreateParentFormData) => {
    try {
      await createParentMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        isActive: data.isActive,
        childIds: data.childIds,
      })
      toast.success("Parent created successfully")
      router.push("/parent/parent_list")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || createParentMutation.isPending

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <PageHeader
        title="Add Parent"
        description="Create a new parent account and link student accounts."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1000px] w-full mx-auto pb-16">
        {/* Back Link */}
        <div>
          <Link
            href="/parent/parent_list"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to All Parents</span>
          </Link>
        </div>

        {/* Form Provider & Layout */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Step 1: Basic Information + Status */}
            <ParentBasicInfoCard control={control} setValue={setValue} />

            {/* Step 2: Link Children with backend search */}
            <ParentLinkChildrenCard
              stepNumber={2}
              linkedChildren={linkedChildren}
              onAddChild={handleAddChild}
              onRemoveChild={handleRemoveChild}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isFormLoading}
                className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isFormLoading}
                className="h-10 px-6 rounded-xl bg-primary text-white border border-[#FDE68A] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isFormLoading && <Loader2 className="size-4 animate-spin text-amber-700" />}
                <span>Create Parent</span>
              </button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
