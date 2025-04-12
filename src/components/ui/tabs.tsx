"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import {   cn   } from require('@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>((
  { className, ...props },
  ref
) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1", className)}
    {...props}
  />
))

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>((
  { className, ...props },
  ref
) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn("inline-flex items-center justify-center px-3 py-1.5", className)}
    {...props}
  />
))

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>((
  { className, ...props },
  ref
) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
))

export { Tabs, TabsList, TabsTrigger, TabsContent }
