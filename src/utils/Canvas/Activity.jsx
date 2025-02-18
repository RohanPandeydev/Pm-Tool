import React, { useEffect, useRef, useState } from "react";
import img from '../../assets/img.png';
import docs from '../../assets/docs.png';
import sheet from '../../assets/sheets.png';
import volume from '../../assets/volume.png';
import video from '../../assets/video.png';
import pdf from '../../assets/pdf.png';
import ppt from '../../assets/ppt.png';
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectServices from "../../services/ProjectServices";
import replaceSpacesWithUnderscores from "../ReplaceSpaceWith_";
import ButtonLoader from "../Loader/ButtonLoader";
import FocusList from "./FocusList";
import InfiniteScrolling from "../InfiniteScrolling";
import ValidateAuthenticationKey from "../ValidateAuthenticationKey";
import { RiDeleteBin6Line } from "react-icons/ri";

const Activity = ({ canvasProjectId, canvasProjectName }) => {
    const [fileInputs, setFileInputs] = useState([0]);
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const [title, setTitle] = useState("");
    const fileTag = useRef([]);
    const queryClient = useQueryClient()
    const [dirveFiles, setDriveFiles] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [pageXOffset, setPageXOffset] = useState(1)
    const allowedExtensions = [
        '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png', '.csv', '.xlsx',
        '.mp4', '.mov', '.wmv', '.flv', '.avi', // Video extensions
        '.mp3', '.wav', '.aac', '.flac',        // Audio extensions
        '.ppt', '.pptx'                         // PowerPoint extensions
    ];
    const extensionToIcon = {
        '.doc': docs,
        '.docx': docs,
        '.pdf': pdf,
        '.jpg': img,
        '.jpeg': img,
        '.png': img,
        '.csv': sheet,
        '.xlsx': sheet,
        '.mp4': video,
        '.mov': video,
        '.wmv': video,
        '.flv': video,
        '.avi': video,
        '.mp3': volume,
        '.wav': volume,
        '.aac': volume,
        '.flac': volume,
        '.ppt': ppt,
        '.pptx': ppt
    };
    const validateFile = (file) => {
        const MAX_FILE_SIZE_MB = 500;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

        let isValid = true;
        let errorMessage = '';

        const fileNameParts = file.name.split('.');
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
        let errorMessage = '';

        files.forEach(file => {
            const fileNameParts = file.name.split('.');
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
    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const { isValid, errorMessage } = validateFile(file);
            if (isValid) {
                const newFiles = [...files];
                newFiles[index] = file;
                setFiles(newFiles);

                const newErrors = [...errors];
                newErrors[index] = '';
                setErrors(newErrors);
            } else {
                const newErrors = [...errors];
                newErrors[index] = errorMessage;
                setErrors(newErrors);
            }
        }
    };
    const addFileInput = () => {


        const removeNull = files.filter((each) => each != null)
        if (fileInputs.length < 5 && (fileInputs.length == removeNull.length)) {
            const newFileInputs = [...fileInputs];
            newFileInputs.push(newFileInputs.length);
            setFileInputs(newFileInputs);
        }

    };
    const handleRemoveFile = (index) => {
        if (fileInputs.length === 1) {
            fileTag.current[index].value = "";
            const newFiles = files.filter((_, i) => i !== index);
            setFiles(newFiles);
            setErrors(newErrors);

            // If there is only one file input tag left, do not remove it
            return;
        }

        // Create new arrays without the removed index
        const newFiles = files.filter((_, i) => i !== index);
        const newErrors = errors.filter((_, i) => i !== index);
        const newFileInputs = fileInputs.filter((_, i) => i !== index);

        // Update state with the new arrays
        setFiles(newFiles);
        setErrors(newErrors);
        setFileInputs(newFileInputs);

        // Reset file input value to show "No file chosen"
        fileTag.current[index].value = "";
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const removeNull = files.filter((each) => each != null)
        //console.log("removeNull", removeNull)
        if (removeNull?.length === 0) {
            const newErrors = [...errors];
            newErrors[0] = "At least one file is required";
            setErrors(newErrors);
            return;
        }
        const validateMultipleFileSize = validateFiles(removeNull);
        if (!validateMultipleFileSize.isValid) {
            toast.error(validateMultipleFileSize.errorMessage);
            return;
        }
        const formData = new FormData();
        formData.append("projectName", replaceSpacesWithUnderscores(canvasProjectName || ""));
        formData.append("title", title);
        formData.append("projectId", canvasProjectId);
        files.forEach(file => formData.append("files", file));

        createMutation.mutate(formData);


        // Perform submission logic here
    };
    const getFileIcon = (fileName) => {
        const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        return extensionToIcon[extension] || 'unknown-icon'; // Default icon for unknown types
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    const handleReset = () => {
        setFileInputs([0])
        setFiles([])
        setErrors([])
        setTitle("")

        // Reset file input tags to "No file chosen"
        fileTag.current.forEach(inputRef => {
            if (inputRef) {
                inputRef.value = "";
            }
        });

    }

    const createMutation = useMutation(
        (formdata) => ProjectServices.activityDriveFilesupload(formdata),
        {
            onSuccess: (data) => {
                if (data?.data?.error) {
                    toast.error(data?.data?.message, { delay: 10 });
                    return;
                }
                toast.success(data?.data?.message, { delay: 10 });
                setDriveFiles([])
                setPageXOffset(() => 1)

                queryClient.invalidateQueries(["drive-files", pageXOffset])
                queryClient.refetchQueries(["drive-files", pageXOffset])
                const scrollableDiv = document.getElementById("scrollableDiv");
                if (scrollableDiv) {
                    scrollableDiv.scrollTop = 0;
                }
                handleReset();
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || err?.message, { delay: 10 });
            },
        }
    );
    const { data, isLoading } = useQuery(
        ['drive-files', pageXOffset],
        () => ProjectServices.activityDriveFiles(`${canvasProjectId}?page=${pageXOffset}&limit=5`),
        {
            onSuccess: (data) => {
                const response = data?.data?.data?.drives;
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




    return (
        <>
            <div className="activity-wrapper">
                <div className="activity-content">
                    <form className="activity-head" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="form-control activity-title"
                            name="name"
                            onChange={handleTitleChange}
                            value={title}
                            placeholder="Enter Title ..."
                            disabled={createMutation?.isLoading}
                        />
                        <br />

                        <div className="upload-img">
                            <div className="multiple-img-upload-bx">
                                {fileInputs.map((input, index) => (

                                    <div className="select-container" key={index}>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => handleFileChange(e, index)}
                                            accept={allowedExtensions}
                                            ref={el => fileTag.current[index] = el} // Store reference to each file input element
                                            disabled={createMutation?.isLoading}
                                        />
                                        {files[index] &&
                                            <div className="input-group">
                                                <img
                                                    height={20}
                                                    width={20}
                                                    className="file-preview"
                                                    src={getFileIcon(files[index].name)}
                                                    alt={files[index].name}
                                                />
                                                <div className="file-name">{files[index].name} ({(files[index].size / 1024 / 1024).toFixed(1)} Mb)</div>
                                                {!createMutation?.isLoading && <div className="file-remove" onClick={() => handleRemoveFile(index)}>
                                                    <RiDeleteBin6Line /> {/* Cross button */}
                                                </div>}
                                            </div>
                                        }
                                        {errors[index] && <div className="text-danger">{errors[index]}</div>}
                                    </div>

                                ))}
                            </div>
                            {!createMutation?.isLoading && fileInputs.length < 5 && fileInputs.length > 0 && (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={addFileInput}
                                    style={{ marginLeft: '10px' }}
                                    disabled={!!!(fileInputs.length == files.length)}
                                >
                                    Add File
                                </button>
                            )}
                        </div>
                        <br />

                        <button
                            type="submit"
                            className="btn ctd-btn"
                            disabled={createMutation?.isLoading}
                        >
                            {createMutation?.isLoading ? <ButtonLoader /> : "Submit"}
                        </button>

                        {/* <button
                            type="button"
                            className="btn"
                            style={{ backgroundColor: "#f6f6f6", marginLeft: '10px' }}
                        >
                            Cancel
                        </button> */}
                    </form>
                </div>
            </div>
            {
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
                        {!!canvasProjectId && <FocusList dirveFiles={dirveFiles} isLoading={isLoading} />}
                    </InfiniteScrolling>
                </div>
            }
        </>
    );
};

export default Activity;
