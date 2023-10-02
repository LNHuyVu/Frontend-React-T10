import React from 'react'
import { Triangle } from 'react-loader-spinner'
const Loading = () => {
  return (
    <div><Triangle
    height="100"
    width="100"
    color="#005eff"
    ariaLabel="triangle-loading"
    wrapperStyle={{}}
    wrapperClassName=""
    visible={true}
  /></div>
  )
}

export default Loading