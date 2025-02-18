import React, { memo, useContext } from "react";
import { TiThMenu } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import "./header.css";
import { ToastContainer, toast } from "react-toastify";
import Headerbg from "../../assets/bg2.jpg";
import inde15Aug from "../../assets/inde15aug.jpg";
import customContext from "../../contexts/Context";
import StorageData from "../../helper/storagehelper/StorageData";
import female from "../../assets/female.png";
import male from "../../assets/male.png";
import logo from "../../assets/logo.png";

const Header = memo(function Header({ handleToggle, name, subname }) {
  const { userData,token } = customContext();
  const regex = /^\/($|team\/projects.*|profile\/.*|tasks.*)/;
  const handleLogout = () => {
    StorageData.removeData();
    toast.success("Logout successfully", { delay: 10 });
    setTimeout(() => {
      window.location.replace("/login");
    }, 2000);
    return;
  };
  // console.log("ff",token)

  const defaultImage =
    userData?.gender === "female"
      ? female
      : userData?.gender === "male"
      ? male
      : logo;


      // console.log("userData",userData)

  return (
    <>
      <header
        className="header-section"
        style={{ backgroundImage: `url(${inde15Aug})` }}
      >
        <div className="head-left">
          <div className="haed-top-menu">
            {!regex.test(window.location.pathname) && (
              <TiThMenu onClick={handleToggle} className="menu" />
            )}

            <span>
              {name} / {subname}
            </span>
          </div>
          {/* <form action="" className='search-form'>
                    <div className='search-input-box'>
                        <IoSearch />
                        <input type="text" placeholder='Search'/>
                    </div>
                    <button type='submit' className='btn search-btn'>
                        <FaPlus />
                    </button>
                </form> */}
        </div>
        <div className="dropdown profile-dm">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {/* <span>{userData?.userName?.slice(0, 3).toUpperCase() || "philips"}</span> */}
            <img
              src={
                (userData?.profileImage && userData?.profileImage) ||
                defaultImage
              }
              className="img-fluid"
            />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            {
              <li>
                <a
                  className="dropdown-item"
                  href={"/profile/" + btoa(userData?._id)}
                >
                  <FaRegUser />
                  Profile
                </a>
              </li>
            }
            <li>
              <a className="dropdown-item" href="/login" onClick={handleLogout}>
                <FaPowerOff />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
});

export default Header;
