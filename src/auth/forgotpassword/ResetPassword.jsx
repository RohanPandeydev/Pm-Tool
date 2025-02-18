import React, { useEffect } from 'react'
import "./forgotPassword.css";
import loginImg from "../../assets/sales.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ResetFormValidation } from '../../helper/ValidationHelper/Validation';
import { FaKey } from 'react-icons/fa6';
import { useMutation } from '@tanstack/react-query';
import AuthServices from '../../services/AuthServices';
import { toast } from 'react-toastify';
import Loader from "../../utils/Loader/Loader";

const ResetPassword = ({ email, otp }) => {
    const [toggleEye, setToggleEye] = useState(false)
    const [loader, setLoader] = useState(true);

    const formik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: ResetFormValidation,
        onSubmit: (values, action) => {
            SubmitHandler(values);
        },
    });
    const SubmitHandler = (data) => {
        // console.log("===>", data)
        resetPassword.mutate({
            otp: otp,
            email: email,
            newPassword: data?.password
        })
    }
    const resetPassword = useMutation(
        (formdata) => AuthServices.resetPassword(formdata),

        {
            onSuccess: (data) => {
                setLoader(false);

                // console.log("Data==>", data?.data);
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 })
                    setLoader(true);
                    return
                }
                // StorageData.setToken(data?.data?.authToken);
                // localStorage.setItem(
                //   "sbsales_crm_admin_details",
                //   JSON.stringify(data?.data?.data?.user)
                // );
                toast.success(data?.data?.message, {
                    position: "top-center",
                });
                // nav('/resetpassword/' + btoa(emailValue) + "/" + btoa(otp))
                setTimeout(()=>{
                    window.location.replace('/login')
                },100)
                setLoader(true);
                return;
            },
            onError: (err) => {
                setLoader(true);
                settoggleResetPassword(false)

                // console.log(err.response?.data?.error);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
                return;
            },
        }
    );


    return (
        <>
            {(resetPassword.isLoading || !loader) && <Loader />}

            <div className="form-wrapper">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="form-image">
                                <img src={loginImg} alt="form computer image" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-content">
                                <h2 className="form-title">Create New Password</h2>
                                <form onSubmit={formik.handleSubmit} className="login-form">
                                    <div className="form-input-box">
                                    <FaLock className="icon" />

                                        <input
                                            type="password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                            placeholder="Password"
                                            name="password"
                                            id="field_email"
                                            className="form-control"
                                        />

                                    </div>
                                    {
                                        formik.touched.password && <p className='text-danger'>{formik.errors.password}</p>
                                    }
                                    <div className="form-input-box">
                                    <FaLock className="icon" />

                                        <input
                                            type={`${toggleEye ? 'text' : 'password'}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmPassword}
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            id="field_email"
                                            className="form-control"
                                        />
                                        {toggleEye ? <FaEyeSlash onClick={() => setToggleEye(!toggleEye)} /> : <FaEye onClick={() => setToggleEye(!toggleEye)} />}
                                    </div>
                                    {
                                        formik.touched.confirmPassword && <p className='text-danger'>{formik.errors.confirmPassword}</p>
                                    }
                                    {/* <div className="form-input-box">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="*******"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    id="field_password"
                    className="form-control"
                  />
                </div> */}
                                    <button type="submit" className="btn submit-btn" disabled={resetPassword?.isLoading}>
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword