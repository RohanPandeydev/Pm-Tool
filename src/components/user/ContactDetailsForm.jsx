import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { IoCloseOutline } from 'react-icons/io5';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ProfileContactDetails } from '../../helper/ValidationHelper/Validation';
import UserServices from '../../services/UserServices';
import ButtonLoader from '../../utils/Loader/ButtonLoader';

const ContactDetailsForm = ({ data, isLoading }) => {
    const queryClient=useQueryClient()

    
    const formik = useFormik({
        initialValues: {
            userName: "",
            dateOfBirth: "",
            gender: "",

        },
        validationSchema: ProfileContactDetails,
        onSubmit: (values, action) => {
            //console.log("values", values);
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
            //console.log("data===================", data?.data)
            formik.setFieldValue("email", data?.data?.data?.user?.email)
            formik.setFieldValue("phoneNumber", data?.data?.data?.user?.phoneNumber);


        }
    }, [isLoading])
    return (
        <div
            className="lead-modal modal fade show"
            id="contactprofile"
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
                            Contact Details
                        </h5>
                    </div>
                    <div className="modal-body">
                        <form
                            // action=""
                            onSubmit={formik.handleSubmit}
                            className="moadal-form"
                        >
                            <div className="row">

                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <div className="modal-form-left">
                                        <div className="model-form-box">
                                            <input
                                                type="text"
                                                value={formik.values?.email}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="email"
                                                placeholder="Email"
                                                className="form-control"
                                            />
                                            {formik.touched.email && (
                                                <p className="text-danger"> {formik.errors.email} </p>
                                            )}
                                        </div>
                                        <div className="model-form-box">
                                            <input
                                                type="text"
                                                value={formik.values?.phoneNumber}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name="phoneNumber"
                                                placeholder="Phone Number"
                                                className="form-control"
                                            />
                                            {formik.touched.phoneNumber && (
                                                <p className="text-danger">
                                                    {" "}
                                                    {formik.errors.phoneNumber}{" "}
                                                </p>
                                            )}
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
        </div>)
}

export default ContactDetailsForm