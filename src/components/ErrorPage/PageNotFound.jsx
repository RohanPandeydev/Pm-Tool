import React, { useContext } from 'react'
import './pagenotfound.css'
import customContext from '../../contexts/Context'
const PageNotFound = () => {
    const { userData } = customContext()
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className='no-found-div'>
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>
                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Look like you're lost
                                </h3>
                                <p>the page you are looking for not avaible!</p>
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

export default PageNotFound