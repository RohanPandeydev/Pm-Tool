import React, {  } from "react";
import {  FaRegCircleDot, FaRegCircleUser } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { MdOutlineTitle } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import { ImFlag } from "react-icons/im";
import { FaCity } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";


const Details = ({ }) => {




    return (
        <>
            {
                <form className="activity-content">

                    <div className="activity-box">
                        <FaRegCircleUser className="activity-icons" />
                        <input
                            type="text"
                            placeholder="Contact Person"

                            name="contactPerson"
                            className="form-control"
                        />

                    </div>
                    <div className="activity-box">
                        <GoOrganization className="activity-icons" />
                        <input
                            type="text"
                            className="form-control"

                            name="organizationName"
                            placeholder="Organization"
                        />

                    </div>
                    <div className="activity-box">
                        <MdOutlineTitle className="activity-icons" />
                        <input
                            type="text"
                            className="form-control"

                            name="title"
                            placeholder="Title"
                        />

                    </div>

                    <div className="activity-box">
                        <FaMoneyBills className="activity-icons" />
                        <div className="input-group">
                            <select
                                value={""}
                                disabled
                                // onChange={(e) => setCostType(e.target.value)}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <option value="">Select Project Cost</option>
                                <option value="Project_Cost">Project Cost</option>
                                <option value="Hourly_Cost">Hourly Cost</option>
                            </select>
                        </div>
                    </div>
                    <div className="activity-box">
                        <FaMoneyBills className="activity-icons" />
                        {<div className="input-group">
                            <input
                                type="number"
                                className="form-control"
                                // value={costCurrency.value}
                                // onChange={handleCurrency}

                                name="value"
                                placeholder="Value"
                                aria-label="Value"
                                aria-describedby="basic-addon2"
                            />
                            <select
                                className="form-select"
                                name="type"
                                // onChange={handleCurrency}
                                aria-label="Default select example"
                                disabled
                            >

                            </select>
                        </div>}
                    </div>
                    <div className="activity-box">
                        <ImFlag className="activity-icons" />
                        <input
                            type="date"

                            name="expectedCloseDate"
                            className="form-control"
                        />

                    </div>
                    <div className="activity-box">
                        <FaCity className="activity-icons" />
                        <input
                            type="text"

                            name="cityOrCountry"
                            className="form-control"
                            placeholder="City/Country"
                        />


                    </div>
                    {/* <div className="activity-box">
                        <FaMoneyBills className="activity-icons" />
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control"
                                
                                value={hourlyCostCurrency.value}
                                onChange={handleHourlyCurrency}
                                name="value"
                                placeholder="Hourly Cost"
                                aria-label="Value"
                                aria-describedby="basic-addon2"
                                disabled={updateLead?.isLoading}
                            />
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                name="type"
                                onChange={handleHourlyCurrency}
                                value={hourlyCostCurrency.type}
                            >
                                {isLoadingCurrency ? <PlaceholderLoader /> : currency?.data?.data?.currency.map((each, index) => {
                                    return (
                                        <option

                                            value={each?.code}
                                            key={each?.code}
                                        >
                                            {each?.code}({each?.symbol})
                                        </option>
                                    );
                                })}
                            </select>
                            {hourlyCostErr && <p className="text-danger"> {hourlyCostErr}</p>}
                        </div>
                    </div> */}
                    <div className="activity-box">
                        <FaRegCircleDot className="activity-icons" />
                        <div
                            className="modal-form-box"
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "centeflex-start",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >

                        </div>
                    </div>


                    {/* <div className="activity-box">
                        <FaRegCircleDot className="activity-icons" />
                        {!isLoadUser && (
                            <Select
                                style={{ width: "100% !important" }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleSelect}
                                value={selectedOptionUser}
                                disabled={updateLead?.isLoading}
                                placeholder="Lead Visibility"
                                options={
                                    visibilityOptions?.length > 0 &&
                                    visibilityOptions?.map((user) => {
                                        return {
                                            value: user?._id,
                                            label: user?.userName,
                                        };
                                    })
                                }
                                isMulti
                            />
                        )}{" "}
                        {formik.touched.rolePermissions && (
                            <p className="text-danger"> {formik.errors.rolePermissions} </p>
                        )}
                    </div> */}
                    <div className="activity-box">
                        <MdLocalPhone className="activity-icons" />



                    </div>
                    <div className="activity-box">
                        <MdOutlineMailOutline className="activity-icons" />



                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn ctd-btn" >
                        </button>
                    </div>
                </form>
            }

        </>
    );
};

export default Details;
