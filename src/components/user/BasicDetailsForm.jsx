import { useFormik } from 'formik';
import React from 'react'
import { IoCloseOutline } from 'react-icons/io5';
import { useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileBasicDetails } from '../../helper/ValidationHelper/Validation';
import UserServices from '../../services/UserServices';
import ButtonLoader from '../../utils/Loader/ButtonLoader';

const BasicDetailsForm = ({ data, isLoading }) => {
    const queryClient=useQueryClient()

   
   
    const formik = useFormik({
        initialValues: {
            userName: "",
            dateOfBirth: "",
            gender: "",

        },
        validationSchema: ProfileBasicDetails,
        onSubmit: (values, action) => {
            // //console.log("values", values);
            updateUser.mutate({...values,id:data?.data?.data?.user?._id})
            return;
        },
    });


    const updateUser = useMutation(
        (formdata) => {
            return UserServices.updateUser(formdata);
        },
        {
            onSuccess: (data) => {
                // //console.log(data?.data?.data);
                toast.success("Update Successfully");
                closeModal()
                queryClient.invalidateQueries('user-details')
                queryClient.refetchQueries('user-details')

            },
            onError: (err) => {
                // //console.log("err>>>", err?.response?.data?.message);
                toast.error(data?.data?.data?.message || err?.response?.data?.message, {
                    delay: 10,
                });
            },
        }
    );



    useEffect(() => {
        if (data && data?.data && !isLoading) {
            // //console.log("data===================", data?.data)
            formik.setFieldValue("userName", data?.data?.data?.user?.userName)
            const utcTime = moment.utc(data?.data?.data?.user?.dateOfBirth);
            formik.setFieldValue("dateOfBirth", utcTime.format("YYYY-MM-DD"));
            formik.setFieldValue("gender", data?.data?.data?.user?.gender);


        }
    }, [isLoading])
    return (
        <div
            className="lead-modal modal fade show"
            id="basicprofile"
            tabIndex="-1"
            data-bs-backdrop="static"
            aria-labelledby="exampleModalLabelProject"
            aria-hidden="true"
        >
            <div className=" modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"

                    // aria-label="Close"
                    >
                        <IoCloseOutline className="close" />
                    </button>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Profile Details
                        </h5>
                    </div>
                    <div className="modal-body">
                        <form
                            // action=""
                            action=""
                            className="moadal-form"
                            onSubmit={formik.handleSubmit}

                        >
                            <div className="row">

                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <div className="modal-form-left">
                                        <div className="model-form-box">
                                            <input
                                                type="text"
                                                placeholder="User Name"
                                                className="form-control"
                                                value={formik.values?.userName}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="userName"

                                            />
                                            {formik.touched.userName && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.userName}{" "}
                                                </p>
                                            )}


                                        </div>
                                        <div className="model-form-box">
                                            <input
                                                type="date"
                                                value={formik.values?.dateOfBirth}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="dateOfBirth"
                                                placeholder="Date of Birth"
                                                className="form-control"
                                            />
                                            {formik.touched.dateOfBirth && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.dateOfBirth}{" "}
                                                </p>
                                            )}˛


                                        </div>
                                        <div className="model-form-box">
                                            <label htmlFor="">Gender</label>
                                            <div className="CheckBox-Content">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="male"
                                                        onClick={() =>
                                                            formik.setFieldValue("gender", "male")
                                                        }
                                                        checked={formik.values.gender == "male"}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="male"
                                                    >
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="female"
                                                        onClick={() =>
                                                            formik.setFieldValue("gender", "female")
                                                        }
                                                        checked={formik.values.gender == "female"}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="female"
                                                    >
                                                        Female
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="other"
                                                        onClick={() =>
                                                            formik.setFieldValue("gender", "other")
                                                        }
                                                        checked={formik.values.gender == "other"}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="other"
                                                    >
                                                        Other
                                                    </label>
                                                </div>
                                                {formik.touched.gender && (
                                                    <p className="text-danger">
                                                        {" "}
                                                        {formik.errors.gender}{" "}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn modal-close-btn"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn modal-save-btn" disabled={updateUser.isLoading} >{updateUser?.isLoading ? <ButtonLoader/>:"Save"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default BasicDetailsForm