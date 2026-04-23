'use client'

import { Repeat } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  textColor?: 'white' | 'dark'
  href?: string
  className?: string
}

export function Logo({ 
  size = 'md', 
  showText = true, 
  textColor = 'white',
  href,
  className = '' 
}: LogoProps) {
  const sizeConfig = {
    sm: {
      container: 'w-9 h-9',
      icon: 'w-5 h-5',
      radius: 'rounded-xl',
      text: 'text-lg',
      gap: 'gap-2.5',
      shadow: '0 4px 16px rgba(52, 199, 89, 0.3)',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-6 h-6',
      radius: 'rounded-xl',
      text: 'text-xl',
      gap: 'gap-2.5',
      shadow: '0 6px 24px rgba(52, 199, 89, 0.35)',
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-10 h-10',
      radius: 'rounded-[20px]',
      text: 'text-[32px]',
      gap: 'gap-4',
      shadow: '0 8px 32px rgba(52, 199, 89, 0.4)',
    },
  }

  const config = sizeConfig[size]
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-gray-900'

  const content = (
    <div className={`flex items-center ${config.gap} ${className} ${href ? 'group' : ''}`}>
      <div
        className={`${config.container} ${config.radius} flex items-center justify-center shrink-0`}
        style={{
          background: 'linear-gradient(135deg, #34c759 0%, #30d158 100%)',
          boxShadow: config.shadow,
        }}
      >
        <Repeat className={`${config.icon} text-white`} strokeWidth={2.5} />
      </div>
      {showText && (
        <span
          className={`${config.text} font-bold ${textColorClass} tracking-tight`}
          style={{ letterSpacing: '-0.02em' }}
        >
          Escambo
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
