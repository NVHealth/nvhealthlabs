import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  textClassName?: string
  iconSize?: number
  showText?: boolean
  href?: string
}

export function Logo({ className = "", textClassName = "", iconSize = 40, showText = true, href = "/" }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/images/nvicon.png"
        alt="NVHealth Labs"
        width={iconSize}
        height={iconSize}
        className="flex-shrink-0"
        priority
      />
      {showText && <span className={`font-bold text-primary-700 ${textClassName}`}>NVHealth Labs</span>}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
