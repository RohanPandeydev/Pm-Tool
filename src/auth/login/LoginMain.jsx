import React from "react";
import { useState } from "react";

import "./login.css";
import loginImg from "../../assets/sales.png";
import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import {toast } from "react-toastify";
import AuthServices from "../../services/AuthServices";
import StorageData from "../../helper/storagehelper/StorageData";
import Loader from "../../utils/Loader/Loader";
const LoginMain = () => {
    const [loader, setLoader] = useState(true);
    const [err, setErr] = useState({ username: "", password: "" })
    const location=useLocation()
    const formik = useFormik({
        initialValues: { username: "", password: "" },
        onSubmit: (values, action) => {
            SubmitHandler(values);
        },
    });
    const SubmitHandler = (data) => {
        if (data?.username == "") {
            setErr({ ...err, username: "Email is required" })
            return false
        }
        if (data?.password == "") {
            setErr({ ...err, password: "Password is required" })
            return false
        }
        mutation.mutate({
            email: data?.username?.toLowerCase()?.trim(),
            password: data?.password,
        });
        return;
    };
    const mutation = useMutation(
        (formdata) => AuthServices.loginAdmin(formdata),

        {
            onSuccess: (data) => {
                // console.log("Data==>", data?.data?.data);
                StorageData.setToken(data?.data?.authToken);
                StorageData.setData(data?.data?.data?.user);
                window.location.replace(location?.state?.path || "/");
                toast.success("Logged In Successfully", {
                    position: "top-center",
                });
                setLoader(false);
                return;
            },
            onError: (err) => {
                setLoader(true);
                console.log(err.response?.data?.error);
                toast.error(err?.response?.data?.error || err?.message, {
                    delay: 10,
                });
                return;
            },
        }
    );

    // console.log("location",location)
    return (
        <>
            {(mutation.isLoading || !loader) && <Loader />}

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
                                <h2 className="form-title">Login</h2>
                                <form onSubmit={formik.handleSubmit} className="login-form">
                                    <div className="form-input-box">
                                        <FaEnvelope className="icon" />
                                        <input
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.username}
                                            placeholder="Email"
                                            name="username"
                                            id="field_email"
                                            className="form-control"
                                        />

                                    </div>
                                    {
                                        err?.username && <p className="text-danger">{err?.username}</p>
                                    }
                                    <div className="form-input-box">
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

                                    </div>
                                    {
                                        err?.password && <p className="text-danger">{err?.password}</p>
                                    }
                                    <button type="submit" className="btn submit-btn">
                                        Submit
                                    </button>
                                    <Link to={"/forgotpassword"} href="#" className="links">
                                        Forgot Password?
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginMain;
