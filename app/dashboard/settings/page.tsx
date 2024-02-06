import CompanySettingsForm from '@/components/(settings)/company-settings-form'
import Heading from '@/components/heading'
import { getCompany } from '@/lib/utils'
import { Company } from '@prisma/client'
import React from 'react'

type Props = {}

const page = async(props: Props) => {
  const company = await getCompany()
  return (
    <div>
      <Heading title='Settings' description='Update your informations'/>

      <div className='mt-12 max-w-5xl rounded-md  '>
        <CompanySettingsForm company={company as Company}/>
      </div>
    </div>
  )
}

export default page