import * as React from 'react'
import { cn } from '../../utils'
import { badgeToneClass, type BadgeTone } from '../../lib/statusStyles'

/**
 * Status / category pill. Reuses the shared tone tokens (see statusStyles) so
 * the 50+ hand-rolled `rounded-full px-3 py-1 ...` badges all match.
 */
export interface BadgeProps extends React.ComponentProps<'span'> {
  tone?: BadgeTone
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
        badgeToneClass[tone],
        className,
      )}
      {...props}
    />
  )
}

export default Badge
