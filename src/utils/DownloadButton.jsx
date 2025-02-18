import React from 'react'
import axios from 'axios';
import { IoDownloadOutline } from "react-icons/io5";

const DownloadButton = ({ fileUrl, fileName }) => {
    const handleDownloadz = async (event) => {
        event.preventDefault();
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = fileUrl.split('/').pop()
  
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Specify the filename for download
        document.body.appendChild(link);
        link.click();
  
        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      };
  const downloadFile = async (event) => {
    try {
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob', // Important: responseType must be 'blob' for binary data
      });

      // Create a temporary anchor element to initiate the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button onClick={(e)=>handleDownloadz(e)} type="button" className="btn btn-secondary dropdown-toggle"><IoDownloadOutline/></button>
  );
};

export default DownloadButton;
