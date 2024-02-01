import React from 'react'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

type Props = {
    children:React.ReactNode
    isLoading:boolean

} & React.HtmlHTMLAttributes<HTMLButtonElement>

const ActionLoaderButton = ({children,isLoading}: Props) => {
  return (
    <Button disabled={isLoading}>{children} {isLoading&&<Loader className='ml-3 h-3 w-3 animate-spin' />}</Button>
  )
}

export default ActionLoaderButton