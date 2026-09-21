"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { UniInput } from "@/components/shared/UniInput"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

export interface TeacherProfessionalInfoCardProps<TFieldValues extends FieldValues = any> {
  control: Control<TFieldValues>
}

export function TeacherProfessionalInfoCard<TFieldValues extends FieldValues = any>({
  control,
}: TeacherProfessionalInfoCardProps<TFieldValues>) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs">
      <h2 className="text-sm font-bold text-zinc-900 mb-5">
        Professional Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <UniInput
          control={control}
          name={"qualifications" as FieldPath<TFieldValues>}
          label="Qualifications"
          placeholder="e.g. M.Sc. in Mathematics, Cairo University"
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />

        <UniInput
          control={control}
          name={"yearsOfExperience" as FieldPath<TFieldValues>}
          label="Years of Experience"
          type="number"
          min="0"
          placeholder="e.g. 5"
          inputClassName="h-10 text-xs rounded-xl"
          labelClassName="text-xs font-medium text-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={"bio" as FieldPath<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-zinc-700">
                Bio <span className="text-zinc-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <textarea
                  rows={3}
                  {...field}
                  value={field.value || ""}
                  placeholder="Short professional biography..."
                  className="w-full p-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all leading-relaxed resize-none placeholder:text-zinc-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={"history" as FieldPath<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-zinc-700">
                History / Career Background{" "}
                <span className="text-zinc-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <textarea
                  rows={3}
                  {...field}
                  value={field.value || ""}
                  placeholder="Key milestones, schools taught, awards..."
                  className="w-full p-3.5 text-xs text-zinc-800 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all leading-relaxed resize-none placeholder:text-zinc-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
