import React from "react";
import "./forgotPassword.css";
import loginImg from "../../assets/sales.png";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Formik, useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AuthServices from "../../services/AuthServices";
import { useState } from "react";
import Loader from "../../utils/Loader/Loader";
const ForgotPassword = () => {
  const nav = useNavigate();
  
  const [loader, setLoader] = useState(true);
  const formik = useFormik({
    initialValues: { username: "" },
    onSubmit: (values, action) => {
      SubmitHandler(values);
    },
  });
  const SubmitHandler = (data) => {
    // //console.log("Data", data);

    const formdata = new FormData();
    formdata.append("email", data?.username.toLowerCase());
    // formdata.append("password", data?.password);
    mutation.mutate({
      email: data?.username?.toLowerCase(),
      //   password: data?.password,
    });
    return;
  };
  const mutation = useMutation(
    (formdata) => AuthServices.forgotPassword(formdata),

    {
      onSuccess: (data) => {
        setLoader(false);

        // //console.log("Data==>", data?.data);
        // StorageData.setToken(data?.data?.authToken);
        // localStorage.setItem(
        //   "sbsales_crm_admin_details",
        //   JSON.stringify(data?.data?.data?.user)
        // );
        toast.success(data?.data?.message, {
          position: "top-center",
        });
        // //console.log("==>",formik.values)
        nav("/otp/"+btoa(formik.values.username))
        formik.resetForm()
        setLoader(true);
        return;
      },
      onError: (err) => {
        setLoader(true);
        // //console.log(err.response?.data?.error);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
        return;
      },
    }
  );
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
                <h2 className="form-title">Forgot Password</h2>
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
                  <button type="submit" className="btn submit-btn">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
