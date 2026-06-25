import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils'

/**
 * The Helper's primary button. Encodes the brand button that was hand-rolled
 * ~80 times across the app in 8+ padding/radius/shadow combinations. Built on
 * the working direct-hex tokens (bg-brand, shadow-brand) — NOT the shadcn
 * `bg-primary` token, which resolves to nothing under this app's hsl setup.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white shadow-brand hover:bg-brand-hover',
        secondary: 'bg-white text-navy border border-[#E2E8F0] hover:bg-[#F8FAFC]',
        ghost: 'text-slate hover:text-navy hover:bg-[#F1F5F9]',
        danger: 'bg-danger-fg text-white hover:opacity-90',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-3 text-sm',
        lg: 'px-8 py-3.5 text-base',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, fullWidth, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />
}

export default Button
