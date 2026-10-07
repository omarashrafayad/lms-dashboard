"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Form } from "@/components/ui/form"
import { getErrorMessage } from "@/components/shared/globalErrorMessage"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { ApiStudent } from "@/features/dashboard/student/types/student.types"
import { useParent, useUpdateParent } from "../hooks/useParents"
import {
  updateParentSchema,
  UpdateParentFormData,
} from "../schema/parent.schema"
import {
  ParentBasicInfoCard,
  ParentAccountInfoCard,
  ParentLinkChildrenCard,
  ParentReviewSummaryCard,
  LinkedChildItem,
} from "../components/form"

export interface ParentEditPageProps {
  parentId: string
}

export default function ParentEditPage({ parentId }: ParentEditPageProps) {
  const router = useRouter()
  const { data: parent, isLoading: isParentLoading, isError } = useParent(parentId)
  const updateParentMutation = useUpdateParent()

  const [addedChildren, setAddedChildren] = React.useState<LinkedChildItem[]>([])
  const [removedChildIds, setRemovedChildIds] = React.useState<string[]>([])

  const linkedChildren: LinkedChildItem[] = React.useMemo(() => {
    const students = parent?.linkedStudents || parent?.childIds || []
    const initial: LinkedChildItem[] = Array.isArray(students)
      ? students.map((c) => ({
          id: c.id || "",
          name: c.fullName || c.name || "Student",
          grade: c.grade || "—",
          stage: c.educationStage || "—",
          email: c.email || "",
        }))
      : []

    const remaining = initial.filter((c) => !removedChildIds.includes(c.id))
    return [...remaining, ...addedChildren]
  }, [parent, addedChildren, removedChildIds])

  const form = useForm<UpdateParentFormData>({
    resolver: zodResolver(updateParentSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      isActive: true,
      sendWelcomeEmail: false,
      childIds: [],
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = form

  const watchedFirstName = useWatch({ control, name: "firstName" })
  const watchedLastName = useWatch({ control, name: "lastName" })
  const dynamicFullName = [watchedFirstName, watchedLastName].filter(Boolean).join(" ")

  React.useEffect(() => {
    if (!parent) return

    const students = parent.linkedStudents || parent.childIds || []
    const initialChildIds = Array.isArray(students)
      ? (students.map((c) => c.id).filter(Boolean) as string[])
      : []

    reset({
      firstName: parent.firstName || "",
      lastName: parent.lastName || "",
      email: parent.email || "",
      phoneNumber: parent.phoneNumber || "",
      isActive: parent.isActive ?? true,
      sendWelcomeEmail: false,
      childIds: initialChildIds,
    })
  }, [parent, reset])

  const handleAddChild = React.useCallback(
    (student: ApiStudent) => {
      setRemovedChildIds((prev) => prev.filter((id) => id !== student.id))
      setAddedChildren((prev) => {
        if (prev.some((c) => c.id === student.id)) return prev
        return [
          ...prev,
          {
            id: student.id,
            name: student.fullName || "Unnamed Student",
            grade: student.grade || "—",
            stage: student.educationStage || "—",
            email: student.email || "",
          },
        ]
      })

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
      setAddedChildren((prev) => prev.filter((c) => c.id !== id))
      setRemovedChildIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

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
    router.push(`/parent/${parentId}`)
  }, [router, parentId])

  const onSubmit = async (data: UpdateParentFormData) => {
    try {
      await updateParentMutation.mutateAsync({
        parentId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          isActive: data.isActive,
          childIds: data.childIds,
        },
      })
      toast.success("Parent updated successfully")
      router.push(`/parent/${parentId}`)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }
  }

  const isFormLoading = isSubmitting || updateParentMutation.isPending

  if (isParentLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-12">
        <LoadingSpinner title="Loading parent details..." />
      </div>
    )
  }

  if (isError || !parent) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader
          title="Edit Parent"
          description="Update parent details and manage linked children accounts."
        />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-rose-600 mb-2">
              Failed to load parent details
            </p>
            <Link
              href="/parent/parent_list"
              className="text-xs text-zinc-500 hover:text-zinc-900 underline"
            >
              Back to All Parents
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={`Edit Parent: ${dynamicFullName || parent.fullName || "Parent"}`}
        description="Update parent details and manage linked children accounts."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
        <div>
          <Link
            href={`/parent/${parentId}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 text-zinc-500" />
            <span>Back to Parent Profile</span>
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <ParentBasicInfoCard control={control} isEditMode={true} />
                <ParentAccountInfoCard control={control} setValue={setValue} />
                <ParentLinkChildrenCard
                  linkedChildren={linkedChildren}
                  onAddChild={handleAddChild}
                  onRemoveChild={handleRemoveChild}
                />
              </div>

              <div className="lg:col-span-1">
                <ParentReviewSummaryCard
                  control={control}
                  linkedChildren={linkedChildren}
                  isSubmitting={isFormLoading}
                  onCancel={handleCancel}
                  submitLabel="Save Changes"
                  isEditMode={true}
                />
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}

