'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"


  import React, { useEffect, useState } from 'react'
  
  type Props = {title:string,children:React.ReactNode,side:"top" | "right" | "bottom" | "left",className?:string ,description?:string ,text?:string,backGround?:string,border?:string}
  
  const ToolTip = ({title,children,side,className,description,text,backGround,border}: Props) => {
    const [mount,setMount]=useState(false)
    useEffect(()=>{setMount(true)},[])
    if(!mount)return null
    return (
        <TooltipProvider>
        <Tooltip delayDuration={40} >
          <TooltipTrigger className={className} type="button" >{children}</TooltipTrigger>
          <TooltipContent className={`${text} ${backGround} ${border}`} side={side || 'left'} >
           <p className={cn("font-medium")}>{title}</p>
{description && <p className="text-xs first-letter:capitalize">{description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  export default ToolTip