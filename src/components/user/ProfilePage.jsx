import React, { memo, useContext, useRef } from "react";
import emp1 from "../../assets/emp1.png";
import emp2 from "../../assets/emp2.png";
import emp3 from "../../assets/emp3.png";
import staff from "../../assets/staff1.png";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import email from "../../assets/contact-ico1.png";
import company from "../../assets/contact-ico2.png";
import client from "../../assets/contact-ico3.png";
import phone from "../../assets/contact-ico4.png";
import designation from "../../assets/contact-ico5.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserServices from "../../services/UserServices";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader/Loader";
import { useState } from "react";
import logo from "../../assets/logo.png";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";

const ProfilePage = ({ id, data }) => {
  const [image, setImage] = useState({});
  const fileInputRef = useRef(null);
  const [err, setError] = useState("");
  const gender = data?.data?.data?.users?.gender;
  const defaultImage =
    gender === "female" ? female : gender === "male" ? male : logo;
  const profileImage = data?.data?.data?.users?.profileImage;
  const queryClient = useQueryClient();
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const handleImage = (e) => {
    if (e?.target?.files?.length == 0) {
      return;
    }
    setImage(URL.createObjectURL(e?.target?.files[0]));
    const validateImage = validateFile(e?.target?.files[0]);
    // //console.log("validateImage", validateImage)
    if (validateImage?.isValid) {
      const formdata = new FormData();
      formdata.append("file", e?.target?.files[0]);
      uploadImage.mutate(formdata);
      return;
    } else {
      setError(validateImage.errorMessage);
      return;
    }
  };
  const uploadImage = useMutation(
    (formdata) => {
      return UserServices.uploadImage(formdata);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          fileInputRef.current.value = null;
          setError("");
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        setError("");
        setImage({});
        queryClient.refetchQueries("user-details");
        queryClient.invalidateQueries("user-details");
        fileInputRef.current.value = null;

        return;
      },
      onError: (err) => {
        // //console.log("Get", err?.response?.data?.data);
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
        setError("");
        setImage({});
        fileInputRef.current.value = null;
      },
    }
  );

  const validateFile = (file) => {
    const MAX_FILE_SIZE_MB = 1;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    let isValid = true;
    let errorMessage = "";

    const fileNameParts = file.name.split(".");
    const extension = `.${fileNameParts[
      fileNameParts.length - 1
    ].toLowerCase()}`;

    if (!allowedExtensions.includes(extension)) {
      isValid = false;
      errorMessage = `Invalid file extension: ${extension}. Allowed extensions are: ${allowedExtensions.join(
        ", "
      )}`;
    } else if (file.size > MAX_FILE_SIZE_BYTES) {
      isValid = false;
      errorMessage = `File size exceeds ${MAX_FILE_SIZE_MB} MB`;
    }

    return { isValid, errorMessage };
  };

  return (
    <>
      {
        <div className="d-flex align-items-center">
          <label for="picFile">
            <div className="staff-img">
              {
                uploadImage?.isLoading ? (
                  <ButtonLoader />
                ) : (
                  <img
                    src={profileImage ? profileImage : defaultImage}
                    alt="Profile Image"
                  // effect="blur"
                  // placeholderSrc={image ? image : defaultImage}
                  />
                )

                // <img src={data?.data?.data?.users?.profileImage ? data?.data?.data?.users?.profileImage : data?.data?.data?.users?.gender == "female" ? female : male} alt='' />
              }
              {/* {
                              uploadImage?.isLoading ? <ButtonLoader /> : <img src={data?.data?.data?.users?.profileImage ? data?.data?.data?.users?.profileImage : data?.data?.data?.users?.gender == "female" ? female : male} alt='' />
                          } */}
            </div>
            <input
              type="file"
              id="picFile"
              onChange={handleImage}
              disabled={uploadImage.isLoading}
              accept={allowedExtensions}
              ref={fileInputRef}
            />
          </label>
          {err && <p className="text-danger">{err}</p>}
          <div className="staff-info">
            <h4>{data?.data?.data?.users?.userName || "Simon Kent"}</h4>
            <ul>
              <li>
                <img src={email} alt="" />{" "}
                {data?.data?.data?.users?.email || "simon.kent@dummy.com"}
              </li>
              <li>
                <img src={company} alt="" />{" "}
                {data?.data?.data?.users?.company?.companyName ||
                  "SB Infowaves Pvt. Ltd."}
              </li>
              <li>
                <img src={client} alt="" />{" "}
                {data?.data?.data?.users?.reportingTo &&
                  data?.data?.data?.users?.reportingTo?.userName &&
                  data?.data?.data?.users?.reportingTo?.userName == "admin"
                  ? "Sb Infowaves"
                  : data?.data?.data?.users?.reportingTo?.userName ||
                  "Allie Grater"}
              </li>
              <li>
                <img src={phone} alt="" />{" "}
                {data?.data?.data?.users?.phoneNumber || "+91 987 456 1234"}
              </li>
              <li>
                <img src={designation} alt="" />{" "}
                {(data?.data?.data?.users?.role &&
                  data?.data?.data?.users?.role?.roleName &&
                  data?.data?.data?.users?.role?.roleName) ||
                  "N/A"}
              </li>
              {/* <li><img src={category} alt='' /> Designer</li> */}
            </ul>
          </div>
        </div>
      }
    </>
  );
};

export default memo(ProfilePage);
