import React, { useEffect } from 'react'
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { IoCloseOutline } from 'react-icons/io5';
import { AddDesignationForm, AddTeamForm } from '../../helper/ValidationHelper/Validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import customContext from '../../contexts/Context';
import TeamServices from '../../services/TeamServices';
import ButtonLoader from '../../utils/Loader/ButtonLoader';
import { useFormik } from 'formik';
import DesignationServices from '../../services/DesignationServices';

const AddDesignationModel = ({ setIsModel, isModel, prefill, setPrefill }) => {



  const queryClient = useQueryClient()
  const formik = useFormik({
    initialValues: {
      name: ""

    },
    validationSchema: AddDesignationForm,
    onSubmit: (values, action) => {
      handleSubmit(values)
      return;

    }
  })
  const handleClose = () => {
    setIsModel(!isModel)
    formik.resetForm();
    setPrefill("")
  }

  const handleSubmit = (data) => {
    // //console.log("Data==>", data)
    if (!!prefill) {
      updateMutation.mutate({
        name: data?.name,
        id: prefill?._id
      })
      return
    }
    createMutation.mutate({
      name: data?.name,
    })
    return

  }



  const createMutation = useMutation(
    (formdata) => {
      return DesignationServices.create(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          console.log("====",data?.data)
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }

        toast.success(data?.data?.message, { delay: 10 });
        handleClose()
        queryClient.invalidateQueries('designation-list')
        queryClient.refetchQueries('designation-list')
        return;
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
      });      },
    }
  );
  const updateMutation = useMutation(
    (formdata) => {
      return DesignationServices.update(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        handleClose()
        queryClient.invalidateQueries('designation-list')
        queryClient.refetchQueries('designation-list')
        return;
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
      });        return
      },
    }
  );


  useEffect(() => {
    // //console.log("Prefilll", !!prefill)
    if (!!prefill) {
      formik.setFieldValue('name', prefill?.name)
    }
  }, [prefill])

  return (
    <>
      <Modal isOpen={isModel} size="lg" toggle={handleClose} centered>
        <ModalHeader close={<button className="close" onClick={handleClose} type="button">
          &times;
        </button>} toggle={handleClose} >
          {!!prefill ? "Update Designation" : "Add Designation"}
        </ModalHeader>

        <ModalBody>
          <form
            action=""
            className="moadal-form"
            onSubmit={formik?.handleSubmit}
          >
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="modal-form-left">
                  <div className="model-form-box">
                    <input
                      type="text"
                      value={formik?.values?.name}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="name"
                      placeholder="Add Designation Name"
                      className="form-control"
                    />
                    {formik.touched.name && (
                      <p className="text-danger">
                        {" "}
                        {formik.errors.name}{" "}
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
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn modal-save-btn"
              // data-bs-dismiss="modal"
              >
                {(createMutation.isLoading || updateMutation?.isLoading) ? <ButtonLoader /> : "Save"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default AddDesignationModel