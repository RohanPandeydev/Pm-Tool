import React, { useContext, useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import { toast } from "react-toastify";
import UserServices from "../services/UserServices";
import customContext from "../contexts/Context";
import MainSidebar from "../layout/sidebarnav/MainSidebar";
import Header from "../layout/header/Header";
import ProfilePage from "../components/user/ProfilePage";
import BasicDetailsForm from "../components/user/BasicDetailsForm";
import ContactDetailsForm from "../components/user/ContactDetailsForm";
import ButtonLoader from "../utils/Loader/ButtonLoader";
import Loader from "../utils/Loader/Loader";

function Profile() {
    const { id } = useParams();
    const [myId, setMyId] = useState("");
    const [toggleStyle, setToggleStyle] = useState(false);
    const { userData } = customContext()
    const nav = useNavigate();
    const handleToggle = () => {
        setToggleStyle(!toggleStyle);
    };

    const { data, isLoading } = useQuery(['user-details', userData?._id], () => {
        return UserServices.getDetails({ id: userData?._id })
    },
        {
            refetchOnWindowFocus: false,
            enabled: !!userData?._id,
            onSuccess: (data) => {
                // //console.log("User Data", data?.data)
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    )





    useEffect(() => {
        try {
            const decodedUserId = atob(id);
            // //console.log("Decoded user ID:", decodedUserId);
            setMyId(() => decodedUserId);
        } catch (error) {
            // console.error("Error decoding user ID:", error.message);
            // Handle the error gracefully, e.g., display an error message to the user
        }

    }, [id]);

    return (
        <>
            <div className="container-fluid">
                <div className="dashboard-wrapper">
                    <MainSidebar />

                    <div className="dash-right">
                        <div className="inner-wrapper">
                            <Header
                                handleToggle={handleToggle}
                                subname={"profile"}
                                name={"user"}
                            />

                            {isLoading ? <Loader /> : <div className="dashboard-body p-3">
                                <div className="overview-bx">
                                    {/* <a href="#" className="btn modal-save-btn custom-btn">
                                        <FaEdit />
                                    </a> */}
                                    {/* <div className='d-flex align-items-center'>
                                        <div className='staff-img'>
                                            <img src={staff} alt='' />
                                        </div>
                                        <div className='staff-info'>
                                            <h4>Simon Kent</h4>
                                            <ul>
                                                <li><img src={email} alt='' /> simon.kent@dummy.com</li>
                                                <li><img src={company} alt='' /> SB Infowaves Pvt. Ltd.</li>
                                                <li><img src={client} alt='' /> Allie Grater</li>
                                                <li><img src={phone} alt='' /> +91 987 456 1234</li>
                                                <li><img src={designation} alt='' /> UI Designer</li>
                                                <li><img src={category} alt='' /> Designer</li>
                                            </ul>
                                        </div>
                                    </div> */}
                                    {!isLoading && <ProfilePage id={myId} isLoading={isLoading} data={data} />}
                                </div>

                                {!isLoading && <div className="row mt-4">
                                    <div className="col-lg-6">
                                        <div className="overview-bx">
                                            <div class="overview-header">
                                                <h4>Primary Details</h4>
                                                <a href="#" className="btn modal-save-btn custom-btn" data-bs-toggle="modal"
                                                    data-bs-target="#basicprofile">
                                                    <FaEdit />
                                                </a>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>User Name</h5>
                                                        <p>{data?.data?.data?.users?.userName || "Simon Kent"}</p>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Gender</h5>
                                                        <p>{data?.data?.data?.users?.gender || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Designation</h5>
                                                        <p>{data?.data?.data?.users?.designation || "N/A"}</p>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Date Of Birth</h5>
                                                        <p>{moment(data?.data?.data?.users?.dateOfBirth).format('ll') || 'N/A'}</p>
                                                    </div>
                                                </div> */}


                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="overview-bx">
                                            <div class="overview-header">
                                                <h4>Contact Details</h4>
                                                <a href="#" className="btn modal-save-btn custom-btn" data-bs-toggle="modal"
                                                    data-bs-target="#contactprofile">
                                                    <FaEdit />
                                                </a>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Phone Number</h5>
                                                        <p>{data?.data?.data?.users?.phoneNumber || "+91 987 456 1234"}</p>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Permanent Address</h5>
                                                        <p>
                                                            936 Kiehn Route, West Ned, Kolkata, West Bengal,
                                                            India 700032
                                                        </p>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-6">
                                                    <div class="description-bx">
                                                        <h5>Email</h5>
                                                        <p>{data?.data?.data?.users?.email || "simon.kent@dummy.com"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {/* {!isLoading && <BasicDetailsForm data={data} isLoading={isLoading} />}
            {!isLoading && <ContactDetailsForm data={data} isLoading={isLoading} />} */}
        </>
    );
}

export default Profile;
