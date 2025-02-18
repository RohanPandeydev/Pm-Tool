import React, { useEffect, useState } from 'react';
import "./forgotPassword.css";
import loginImg from "../../assets/sales.png";
import OtpInput from 'react-otp-input';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthServices from '../../services/AuthServices';
import Loader from "../../utils/Loader/Loader";
import { toast } from 'react-toastify';
import ResetPassword from './ResetPassword';

function Otp() {

    const { email } = useParams()
    const [otp, setOtp] = useState('');
    const [emailValue, setEmailValue] = useState("")
    const [loader, setLoader] = useState(true);
    const [toggleResetPassword,settoggleResetPassword]=useState(false)
    const nav = useNavigate()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log("My Otp", otp, otp.length)
        if (otp.length < 4) {
            toast.error("Please Fill all fields.")
            return;
        }
        sendOtp.mutate({
            otp: otp,
            email: emailValue

        })


    }
    function obfuscateEmail(email) {
        // Split the email address into local part and domain part
        const [localPart, domainPart] = email.split('@');

        // Replace characters in the local part with "x" starting from the fourth character before the "@" symbol
        const obfuscatedLocalPart = localPart.substring(0, localPart.length - 4) + 'xxxx';

        // Concatenate the obfuscated local part with the domain part and return
        return obfuscatedLocalPart + '@' + domainPart;
    }
    const mutation = useMutation(
        (formdata) => AuthServices.forgotPassword(formdata),
    
        {
          onSuccess: (data) => {
            setLoader(false);
            setOtp("")
                // StorageData.setToken(data?.data?.authToken);
            // localStorage.setItem(
            //   "sbsales_crm_admin_details",
            //   JSON.stringify(data?.data?.data?.user)
            // );
            toast.success(data?.data?.message, {
              position: "top-center",
            });
            setLoader(true);
            return;
          },
          onError: (err) => {
            setLoader(true);
            // console.log(err.response?.data?.error);
            toast.error(err?.response?.data?.message || err?.message, {
              delay: 10,
            });
            return;
          },
        }
      );


    const sendOtp = useMutation(
        (formdata) => AuthServices.verifyOtp(formdata),

        {
            onSuccess: (data) => {
                setLoader(false);

                // console.log("Data==>", data?.data);
                if(data?.data?.error){
                    toast.error(data?.data?.message,{delay:10})
                    setLoader(true)
                    setOtp("")
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
                settoggleResetPassword(true)
                setLoader(true);
                return;
            },
            onError: (err) => {
                setLoader(true);
                setOtp("")
                settoggleResetPassword(false)

                // console.log(err.response?.data?.error);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
                return;
            },
        }
    );



    useEffect(() => {
        try {
            const decodedUserId = atob(email);
            // console.log("Decoded user ID:", decodedUserId);
            setEmailValue(() => decodedUserId)
        } catch (error) {
            console.error("Error decoding user ID:", error.message);
            toast.error("Invalid Email", { delay: 10 })
            setTimeout(() => {
                nav("/forgotpassword")
            }, 1000)

            // Handle the error gracefully, e.g., display an error message to the user
        }
    }, [email]);

    return (
        <>
            {(sendOtp.isLoading ||mutation.isLoading || !loader) && <Loader />}
            {
              toggleResetPassword?  <ResetPassword email={emailValue} otp={otp}/>:   <div className="form-wrapper">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="form-image">
                                <img src={loginImg} alt="form computer image" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-content">
                                <h2 className="form-title">Verification</h2>
                                <form className="login-form" onSubmit={handleSubmit}>
                                    <p>Otp send to <span>{emailValue}</span></p>

                                    <div className='otp-bx'>
                                        <OtpInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={4}
                                            renderSeparator={<span>-</span>}
                                            renderInput={(props) => <input {...props} // Add conditional className
                                            />}
                                        />

                                    </div>
                                        <p>Didn't received the OTP ? <a href='#' onClick={()=>mutation.mutate({email:emailValue})}>Resend OTP</a></p>
                                    <button type="submit" className="btn submit-btn">
                                        Verify
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }

         

        </>
    )
}

export default Otp