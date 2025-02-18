import React from 'react'
import './dashboard.css'
import landLogo from '../../assets/logo.png'

const LandRightComp = () => {
  return (
    <>
        <div className="land-logo-wrapper">
            <div className='land-logo'>
                <img src={landLogo} alt="" className='img-fluid'/>
            </div>
        </div>
    </>
  )
}

export default LandRightComp