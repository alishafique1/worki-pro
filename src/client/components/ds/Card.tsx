import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils'

/**
 * Surface card. Replaces the 50+ hand-rolled `bg-white border border-[#E2E8F0]
 * rounded-[..] p-..` wrappers (which used 5 different radii). `radius="card"`
 * for standard cards, `radius="panel"` for large surfaces/modals.
 */
const cardVariants = cva('bg-white border border-[#E2E8F0]', {
  variants: {
    radius: { card: 'rounded-card', panel: 'rounded-panel' },
    padding: { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' },
  },
  defaultVariants: { radius: 'card', padding: 'md' },
})

export interface CardProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, radius, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ radius, padding }), className)} {...props} />
}

export default Card
