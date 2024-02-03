'use client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

type Props = {
    title?:string,
    href:string,
    variant?:"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "site" | "siteSecondary" | null | undefined
    
} & React.HtmlHTMLAttributes<HTMLButtonElement>

const NavigatorButton = ({title,href,className,children,variant}: Props) => {
    const router = useRouter()
  return (
    <Button variant={variant} className={className} onClick={()=>{;router.push(href)}}>{title || children}</Button>
  )
}

export default NavigatorButton