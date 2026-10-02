"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
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
  ParentAccountInfoCard,
  ParentLinkChildrenCard,
  ParentReviewSummaryCard,
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
        description="Create a new parent account and manage their initial account setup."
      />

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-16">
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: Form Cards (Span 2) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <ParentBasicInfoCard control={control} />
                <ParentAccountInfoCard control={control} setValue={setValue} />
                <ParentLinkChildrenCard
                  linkedChildren={linkedChildren}
                  onAddChild={handleAddChild}
                  onRemoveChild={handleRemoveChild}
                />
              </div>

              {/* Right Column: Live Summary & Actions */}
              <div className="lg:col-span-1">
                <ParentReviewSummaryCard
                  control={control}
                  linkedChildren={linkedChildren}
                  isSubmitting={isFormLoading}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
