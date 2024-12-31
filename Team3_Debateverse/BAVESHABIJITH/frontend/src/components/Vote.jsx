import React, { useRef } from 'react'

const Vote = ({closePopup}) => {

    const popref= useRef();

  return (
    <div ref={popref} onClick={(e)=> {e.target==popref.current && closePopup()}} className='fixed inset-0 flex justify-center items-center backdrop-blur'>
        <div className='bg-blue-500 rounded-lg p-10'>
            <h1>This for voting</h1>
        </div>
    </div>
  )
}

export default Vote;