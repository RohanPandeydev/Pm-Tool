import React from 'react'
import nodata from '../assets/nodatafound.png'

const NoImageFound = () => {
  return (
    <> <div className="no-img">
    <img src={nodata} />
  </div></>
  )
}

export default NoImageFound