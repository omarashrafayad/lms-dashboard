"use client";

import * as React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface UniInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  autoComplete?: string;
  readOnly?: boolean;
  min?: string | number;
  step?: string | number;
}

export function UniInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  required = false,
  helperText,
  autoComplete,
  readOnly,
}: UniInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(className)}>
          {label && (
            <FormLabel className={cn("text-base text-content-secondary font-medium cursor-pointer", labelClassName)}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                readOnly={readOnly}
                className={cn(
                  "h-12 rounded-xl border px-4 shadow-none bg-white transition-colors",
                  fieldState.error ? "border-destructive focus-visible:ring-destructive" : "border-divider/50 focus:border-primary",
                  isPassword ? "pr-12" : "",
                  inputClassName
                )}
                {...field}
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {helperText && (
            <p className="text-xs text-content-tertiary">
              {helperText}
            </p>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}