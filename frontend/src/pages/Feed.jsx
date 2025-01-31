import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div>
        {
            [1,2,3,4].map((item,index)=>
         <Posts key={index}/>
        
        )
        }
    </div>
  )
}

export default Feed