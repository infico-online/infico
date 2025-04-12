import { ComponentPropsWithoutRef, ElementRef } from "react"
import * as React from "react"

// Базовый тип для компонентов с ref
export type ComponentWithRef<T extends React.ElementType> = {
  ref?: React.Ref<ElementRef<T>>
} & ComponentPropsWithoutRef<T>

// Тип для компонентов с вариантами
export type VariantProps<T> = {
  variant?: T
  size?: "sm" | "md" | "lg"
  className?: string
}

// Тип для компонентов с детьми
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode
}
