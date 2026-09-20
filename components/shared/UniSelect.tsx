"use client"

import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface SelectOption {
  label: string
  value: string
}

interface UniSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  placeholder?: string
  options: SelectOption[]
  className?: string
  triggerClassName?: string
  labelClassName?: string
  disabled?: boolean
  required?: boolean
  helperText?: string
  isLoading?: boolean
  onChangeCallback?: (value: string) => void
}

export function UniSelect<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  triggerClassName,
  labelClassName,
  disabled = false,
  required = false,
  helperText,
  isLoading = false,
  onChangeCallback,
}: UniSelectProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((opt) => opt.value === field.value)

        return (
          <FormItem className={cn(className)}>
            {label && (
              <FormLabel
                className={cn(
                  "text-xs font-medium text-zinc-700 cursor-pointer",
                  labelClassName
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Select
                value={field.value || null}
                items={options}
                onValueChange={(val) => {
                  const selectedVal = val ?? ""
                  field.onChange(selectedVal)
                  onChangeCallback?.(selectedVal)
                }}
                disabled={disabled || isLoading}
              >
                <SelectTrigger
                  className={cn(
                    "!w-full h-10 text-xs rounded-xl border border-zinc-200/80 bg-white px-3 shadow-none transition-colors",
                    fieldState.error
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus:border-primary",
                    triggerClassName
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={placeholder}>
                      {selectedOption ? selectedOption.label : undefined}
                    </SelectValue>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {helperText && (
              <p className="text-xs text-content-tertiary">{helperText}</p>
            )}
            <FormMessage className="text-xs" />
          </FormItem>
        )
      }}
    />
  )
}
