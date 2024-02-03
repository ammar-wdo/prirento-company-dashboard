import ExtraOptionsFeed from '@/components/(extra options)/extra-options-feed'
import Heading from '@/components/heading'
import NavigatorButton from '@/components/navigator-button'
import React from 'react'

type Props = {params:{carId:string}}

export const revalidate = 0

const page = async({params}: Props) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
      <Heading title='Extra options' description='Create extra options to add to your car '/>
      <NavigatorButton href={`/dashboard/cars/${params.carId}/extra-options/new`}>Create extra option</NavigatorButton>
      </div>
       

        <div className='mt-12'>
          <ExtraOptionsFeed carId={params.carId}/>
        </div>
    </div>
  )
}

export default page