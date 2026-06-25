import * as React from 'react'
import { cn } from '../../utils'

/**
 * Heading with the brand type system baked in.
 *
 * Fraunces (the display serif) is the brand voice but was applied in only ~7
 * places app-wide. This puts it on h1/h2 and enforces weight discipline:
 * font-black is reserved for display headings, h3 steps down to DM Sans bold —
 * so hierarchy comes from weight + family, not just size.
 */
type HeadingLevel = 1 | 2 | 3

const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: "font-['Fraunces',serif] text-3xl sm:text-4xl font-black tracking-tight text-navy",
  2: "font-['Fraunces',serif] text-2xl font-black tracking-tight text-navy",
  3: 'text-lg font-bold tracking-tight text-navy',
}

export interface HeadingProps extends React.ComponentProps<'h2'> {
  level?: HeadingLevel
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
  return <Tag className={cn(LEVEL_CLASS[level], className)} {...props} />
}

export default Heading
