import React, { useContext } from 'react'
import '../components/ErrorPage/pagenotfound.css'
import customContext from '../contexts/Context';
const AccessDenied = () => {
  const { userData } = customContext();
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className='no-found-div'>
              <div className="four_zero_four_bg">
                {/* <h1 className="text-center ">Unauthorised Person</h1> */}
              </div>
              <div className="contant_box_404">
                <h3 className="h2">
                  Access Denied
                </h3>
                <p>You dont have access for this page!</p>
                {
                  (userData && userData?._id) ? <a href="/" className="">Go to Home</a> : <a href="/login" className="">Go to Home</a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccessDenied