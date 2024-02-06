import React from 'react'

type Props = {
    children:React.ReactNode
}

const FormWrapper = ({children}: Props) => {
  return (
    <div className=' rounded-md bg-white border md:px-6 px-2 py-6 '>{children}</div>
  )
}

export default FormWrapper