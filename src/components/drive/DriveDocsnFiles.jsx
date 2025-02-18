/* eslint-disable react/jsx-key */
import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import doc from "../../assets/d1.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectDriveServices from "../../services/ProjectDriveServices";
import InfiniteScrolling from "../../utils/InfiniteScrolling";
import docs from "../../assets/docs.png";
import sheet from "../../assets/sheets.png";
import volume from "../../assets/volume.png";
import video from "../../assets/video.png";
import pdf from "../../assets/pdf.png";
import ppt from "../../assets/ppt.png";
import img from "../../assets/img.png";

import moment from "moment";
import ProjectServices from "../../services/ProjectServices";
import { RiDeleteBin6Line } from "react-icons/ri";
import replaceSpacesWithUnderscores from "../../utils/ReplaceSpaceWith_";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { IoMdClose } from "react-icons/io";
const DriveDocsnFiles = ({ id, name }) => {
  const [files, setFiles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageXOffset, setPageXOffset] = useState(1);
  const [dirveFiles, setDriveFiles] = useState([]);
  const [fileInputs, setFileInputs] = useState([0]);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const fileTag = useRef([]);
  const queryClient = useQueryClient();
  const [filesDetails, setFileDetails] = useState([]);

  const allowedExtensions = [
    ".doc",
    ".docx",
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".csv",
    ".xlsx",
    ".mp4",
    ".mov",
    ".wmv",
    ".flv",
    ".avi", // Video extensions
    ".mp3",
    ".wav",
    ".aac",
    ".flac", // Audio extensions
    ".ppt",
    ".pptx", // PowerPoint extensions
  ];
  const getFileIcon = (fileName, file) => {
    const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
    if (
      extension.includes("jpeg") ||
      extension.includes("png") ||
      extension.includes("jpg")
    ) {
      return URL.createObjectURL(file);
    }
    return extensionToIcon[extension] || "unknown-icon"; // Default icon for unknown types
  };

  const { data, isLoading } = useQuery(
    ["drive-docs", pageXOffset],
    () => ProjectDriveServices.DriveFiles(`${id}?page=${pageXOffset}&limit=5`),
    {
      onSuccess: (data) => {
        const response = data?.data?.data?.drives;
        console.log("============>", response);
        if (response.length < 5) {
          setHasMore(false); // No more items to load
        } else {
          setHasMore(true); // More items can be loaded
        }

        let uniqueArray = [...new Set([...dirveFiles, ...response])];
        setDriveFiles(uniqueArray);
      },
      onError: (err) => {
        if (err?.response?.status === 401) {
          ValidateAuthenticationKey(
            err?.response?.status,
            "Your login session has expired. Please log in again."
          );
          return;
        }
        // Handle other errors if necessary
      },
    }
  );

  const extensionToIcon = {
    ".doc": docs,
    ".docx": docs,
    ".pdf": pdf,
    ".jpg": img,
    ".jpeg": img,
    ".png": img,
    ".csv": sheet,
    ".xlsx": sheet,
    ".mp4": video,
    ".mov": video,
    ".wmv": video,
    ".flv": video,
    ".avi": video,
    ".mp3": volume,
    ".wav": volume,
    ".aac": volume,
    ".flac": volume,
    ".ppt": ppt,
    ".pptx": ppt,
  };
  const validateFile = (file) => {
    const MAX_FILE_SIZE_MB = 500;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    let isValid = true;
    let errorMessage = "";

    const fileNameParts = file.name.split(".");
    const extension = `.${fileNameParts[fileNameParts.length - 1]}`;

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      isValid = false;
      errorMessage = `Invalid file extension: ${extension}`;
    } else if (file.size > MAX_FILE_SIZE_BYTES) {
      isValid = false;
      errorMessage = `File size exceeds ${MAX_FILE_SIZE_MB} MB`;
    }

    return { isValid, errorMessage };
  };
  const validateFiles = (files) => {
    const MAX_TOTAL_SIZE_MB = 500;
    const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
    let totalSize = 0;
    let isValid = true;
    let errorMessage = "";

    files.forEach((file) => {
      const fileNameParts = file.name.split(".");
      const extension = `.${fileNameParts[fileNameParts.length - 1]}`;

      if (!allowedExtensions.includes(extension.toLowerCase())) {
        isValid = false;
        errorMessage = `Invalid file extension: ${extension}`;
      }

      totalSize += file.size;
    });

    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
      isValid = false;
      errorMessage = `Total file size exceeds ${MAX_TOTAL_SIZE_MB} MB`;
    }

    return { isValid, errorMessage, totalSize };
  };
  const handleFileChangeSingle = (e) => {
    const file = e.target.files[0];
    let index = file.length;
    if (file) {
      const { isValid, errorMessage } = validateFile(file);
      if (isValid) {
        // const newFiles = [...files];
        // newFiles[index] = file;
        setFiles(() => {
          return [...files, file];
        });
        // setFileDetails(() => {
        //   return [...filesDetails, file];
        // });
      } else {
        // const newErrors = [...errors];
        // newErrors[index] = errorMessage;
        // setErrors(newErrors);

        toast.error(errorMessage, { delay: 10 });
      }
    }
  };
  // const handleFileChange = (e, index) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const { isValid, errorMessage } = validateFile(file);
  //     if (isValid) {
  //       const newFiles = [...files];
  //       newFiles[index] = file;
  //       setFiles(newFiles);

  //       const newErrors = [...errors];
  //       newErrors[index] = '';
  //       setErrors(newErrors);
  //     } else {
  //       const newErrors = [...errors];
  //       newErrors[index] = errorMessage;
  //       setErrors(newErrors);
  //     }
  //   }
  // };
  const addFileInput = () => {
    const removeNull = files.filter((each) => each != null);
    // if (fileInputs.length < 5 && fileInputs.length == removeNull.length) {
    //   const newFileInputs = [...fileInputs];
    //   newFileInputs.push(newFileInputs.length);
    //   setFileInputs(newFileInputs);
    // }
  };
  const handleRemoveFile = (index) => {
      // fileTag.current[index].value = "";
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      // setFileDetails(newFiles);
      // setErrors(newErrors);

      // If there is only one file input tag left, do not remove it
      return;
    
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const removeNull = files.filter((each) => each != null);
    //console.log("removeNull", removeNull)
    if (removeNull?.length === 0) {
      // const newErrors = [...errors];
      // newErrors[0] = "Please select a file";
      // setErrors(newErrors);
      toast.error("Please select a file");
      return;
    }
    if (removeNull?.length >5) {
      // const newErrors = [...errors];
      // newErrors[0] = "Please select a file";
      // setErrors(newErrors);
      toast.error("You can upload up to 5 files at a time.");
      return;
    }
    const validateMultipleFileSize = validateFiles(removeNull);
    if (!validateMultipleFileSize.isValid) {
      toast.error(validateMultipleFileSize.errorMessage);
      return;
    }
    const formData = new FormData();
    formData.append("projectName", replaceSpacesWithUnderscores(name || ""));
    formData.append("title", title);
    formData.append("projectId", id);
    files.forEach((file) => formData.append("files", file));

    createMutation.mutate(formData);

    // Perform submission logic here
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleReset = () => {
    // setFileInputs([0]);
    setFiles([]);
    
    
    // setErrors([]);
    setTitle("");
    console.log("File Tag",fileTag)
    if(!fileTag.current)return
    fileTag.current.value = "";
    // Reset file input tags to "No file chosen"
    // fileTag.current.forEach(inputRef => {
    //   if (inputRef) {
    //     inputRef.value = "";
    //   }
    // });
  
  };
  // console.log("fileTag",fileTag,"fileTag")

  const createMutation = useMutation(
    (formdata) => ProjectServices.activityDriveFilesupload(formdata),
    {
      onSuccess: (data) => {
        if (data?.data?.error) {
          toast.error(data?.data?.message, { delay: 10 });
          return;
        }
        toast.success(data?.data?.message, { delay: 10 });
        setDriveFiles([]);
        setPageXOffset(() => 1);

        queryClient.invalidateQueries(["drive-docs", pageXOffset]);
        queryClient.refetchQueries(["drive-docs", pageXOffset]);
        const scrollableDiv = document.getElementById("scrollableDiv");
        if (scrollableDiv) {
          scrollableDiv.scrollTop = 0;
        }
        handleReset();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err?.message, {
          delay: 10,
        });
      },
    }
  );

  // const allowedExtensions = [
  //   '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png', '.csv', '.xlsx',
  //   '.mp4', '.mov', '.wmv', '.flv', '.avi', // Video extensions
  //   '.mp3', '.wav', '.aac', '.flac',        // Audio extensions
  //   '.ppt', '.pptx'                         // PowerPoint extensions
  // ];
  const getFileIconShow = (fileType, url) => {
    const extension = fileType?.toLowerCase();
    // //console.log("fileType", fileType);

    switch (true) {
      case extension.includes(
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ):
        return { icon: ppt, url };
      case extension.includes("application/msword") ||
        extension.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ):
        return { icon: docs, url };
      case extension.includes("application/pdf"):
        return { icon: pdf, url };
      case extension.includes("image/jpeg") || extension.includes("image/png"):
        return { icon: url, url };
      case extension.includes("text/csv") ||
        extension.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ):
        return { icon: sheet, url };
      case extension.includes("video/mp4") ||
        extension.includes("video/quicktime") ||
        extension.includes("video/x-ms-wmv") ||
        extension.includes("video/x-flv") ||
        extension.includes("video/x-msvideo"):
        return { icon: video, url };
      case extension.includes("audio/mpeg") ||
        extension.includes("audio/wav") ||
        extension.includes("audio/aac") ||
        extension.includes("audio/flac"):
        return { icon: volume, url };
      default:
        return null; // Default icon or handle unknown types
    }
  };


  return (
    <>
      <div className="docs-file-upload-wrap">
        <div className="file-upload-submit-btn">
          <div className="upload-file-button">
              <label htmlFor="upload-docs-img">
                <span>Add File</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChangeSingle(e)}
                  accept={allowedExtensions}
                  ref={fileTag} // Store reference to each file input element
                  disabled={createMutation?.isLoading}
                  id="upload-docs-img"
                />
              </label>
            
          </div>
          {files.length > 0 && (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn ctd-btn"
              disabled={createMutation?.isLoading}
            >
              {createMutation?.isLoading ? <ButtonLoader /> : "Submit"}
            </button>
          )}
          {/* <button type="submit" class="btn ctd-btn">Submit</button> */}
        </div>
        <div className="upload-docs-file-wrap">
          <div className="row">
            {files?.length > 0 &&
              files?.map((each, index) => {
                return (
                  <div className="upload-docs-file-list-wrap">
                    <div className="upload-docs-file-list">
                      <Button
                        className="close-btn"
                        disabled={createMutation?.isLoading}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <IoMdClose />
                      </Button>
                      <img
                      loading="lazy"
                        className="img-fluid"
                        src={getFileIcon(each?.name, each)}
                        alt="Sb Info"
                      />
                    </div>
                  </div>
                );
              })}

            {/* <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3">
                <div className="upload-docs-file-list">
                  <Button className="close-btn"><IoMdClose /></Button>
                  <img className="img-fluid" src="https://appteamsbinfo.s3.amazonaws.com/pmtool/user_profile/1720426828839-Big_%26_Small_Pumkins.JPG" alt="Sb Info" />
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3">
                <div className="upload-docs-file-list">
                  <Button className="close-btn"><IoMdClose /></Button>
                  <img className="img-fluid" src="https://appteamsbinfo.s3.amazonaws.com/pmtool/user_profile/1720426828839-Big_%26_Small_Pumkins.JPG" alt="Sb Info" />
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3">
                <div className="upload-docs-file-list">
                  <Button className="close-btn"><IoMdClose /></Button>
                  <img className="img-fluid" src="https://appteamsbinfo.s3.amazonaws.com/pmtool/user_profile/1720426828839-Big_%26_Small_Pumkins.JPG" alt="Sb Info" />
                </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3">
                <div className="upload-docs-file-list">
                  <Button className="close-btn"><IoMdClose /></Button>
                  <img className="img-fluid" src="https://appteamsbinfo.s3.amazonaws.com/pmtool/user_profile/1720426828839-Big_%26_Small_Pumkins.JPG" alt="Sb Info" />
                </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="upload-img">
        {/* <input
                            type="text"
                            className="form-control activity-title"
                            name="name"
                            onChange={handleTitleChange}
                            value={title}
                            placeholder="Enter Title ..."
                            disabled={createMutation?.isLoading}
                        /> */}
        <div className="multiple-img-upload-bx">
          {/* {filesDetails.map((input, index) => (

            <div className="select-container" key={index}>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, index)}
                accept={allowedExtensions}
                ref={el => fileTag.current[index] = el} // Store reference to each file input element
                disabled={createMutation?.isLoading}
              />
              {filesDetails[index] &&
                <div className="input-group">
                  <img
                    height={20}
                    width={20}
                    className="file-preview"
                    src={getFileIcon(filesDetails[index].name)}
                    alt={filesDetails[index].name}
                  />
                  <div className="file-name">{filesDetails[index].name} ({(filesDetails[index].size / 1024 / 1024).toFixed(1)} Mb)</div>
                  {!createMutation?.isLoading && <div className="file-remove" onClick={() => handleRemoveFile(index)}>
                    <RiDeleteBin6Line />
                  </div>}
                </div>
              }
              {errors[index] && <div className="text-danger">{errors[index]}</div>}
            </div>

          ))} */}
        </div>
        {/* {!createMutation?.isLoading &&
          fileInputs.length < 5 &&
          fileInputs.length > 0 && (
            <button
              type="button"
              className="btn ctd-btn mx-2"
              onClick={addFileInput}
              disabled={!!!(fileInputs.length == files.length)}
            >
              Add File
            </button>
          )}

        <button
          type="submit"
          onClick={handleSubmit}
          className="btn ctd-btn"
          disabled={createMutation?.isLoading}
        >
          {createMutation?.isLoading ? <ButtonLoader /> : "Submit"}
        </button> */}
      </div>
      <div className="overview-bx">
        <div className="dash-right-head">
          <h4>Docs & Files</h4>
        </div>
        <div
          id="scrollableDiv"
          style={{
            height: 400,
            overflowY: "scroll", // Enable vertical scrolling
          }}
        >
          <InfiniteScrolling
            hasMore={hasMore}
            items={dirveFiles}
            setPage={setPageXOffset}
          >
            <div className="doc-part uploaded-docsfile-wrap mt-3">
              {dirveFiles.map((file, index) => {
                return (
                  file?.files?.length > 0 &&
                  file?.files?.map((elem) => {
                    return (
                      <div className="doc-bx ">
                        <a
                          target="_sb"
                          href={getFileIconShow(elem?.fileType, elem?.url)?.url}
                          download={true}
                        >
                          <div className="doc-img">
                            <img
                            loading="lazy"
                              className="img-fluid"
                              src={
                                getFileIconShow(elem?.fileType, elem?.url)?.icon
                              }
                              alt=""
                            />
                          </div>
                          {/* <p>{file?.title || 'n/a'}</p> */}
                          <p>{moment(file?.createdAt).format("ll")}</p>
                        </a>
                      </div>
                    );
                  })
                );
              })}
            </div>
          </InfiniteScrolling>
        </div>
      </div>
    </>
  );
};

export default DriveDocsnFiles;
