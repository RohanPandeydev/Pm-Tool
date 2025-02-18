import React, { memo, useEffect } from 'react'
import background from '../assets/bg1.png';
import ico1 from "../assets/ico1.png";
import ico2 from "../assets/ico2.png";
import ico3 from "../assets/ico3.png";
import ico4 from "../assets/ico4.png";
import ico5 from "../assets/ico5.png";
import ico6 from "../assets/ico6.png";
import up from "../assets/up.png";
import down from "../assets/down.png";
// import { MonthYearPickerInput } from '../MonthYearInput';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { GrPowerReset } from 'react-icons/gr';
import ButtonLoader from './Loader/ButtonLoader';
import { MonthYearPickerInput } from './MonthYearInput';

const FilterCardsPerformance = ({ stats, handleStartDateChange, handleEndDateChange, startDate, endDate, handleSubmit, handleChange, handleReset, selectedDate, isOverAllPerformanceLoaded }) => {
    return (
        <div>    <div className="row mt-3">
           { stats?.dealsData && <div className="col-md-3">
                <div className="lead-bx" style={{ backgroundImage: `url(${background})` }}>
                    <h5>Total Leads</h5>
                    <h3>{stats && stats?.totalLeads && stats?.totalLeads[0] && stats?.totalLeads[0]?.totalLeads || 0}</h3>
                </div>
            </div>}

            <div className="col-md-9">
                <div className="dashboard-head">
                    <label>Search by</label>

                    <div className="right-nav-content-right mt-3">
                        <div className="form-group">
                            <input className="form-control" type="date" max={new Date().toISOString().split('T')[0]} placeholder="Start Date" value={startDate} onChange={handleStartDateChange} />
                            {/* <DatePicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                maxDate={new Date()} // Disable future dates
                                placeholderText="Start Date"
                                showIcon
                                icon={<FaCalendarAlt />}
                                className="date-picker-input"
                            /> */}

                        </div>
                        <div className="form-group">
                            {/* <DatePicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                maxDate={new Date()} // Disable future dates
                                placeholderText="End Date"
                                showIcon
                                icon={<FaCalendarAlt />}
                                className="date-picker-input"
                            /> */}
                            <input className="form-control" type="date" max={new Date().toISOString().split('T')[0]} placeholder="End Date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                        <button type="button" className="btn modal-save-btn" disabled={isOverAllPerformanceLoaded} onClick={handleSubmit}>
                            {
                                isOverAllPerformanceLoaded ? <ButtonLoader /> : "Search"
                            }
                        </button>
                        <div className="form-group">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleChange}
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                                customInput={<MonthYearPickerInput />}
                                maxDate={new Date()} // Disable future dates
                                placeholderText="MM/yyyy"
                                showIcon
                                icon={<FaCalendarAlt />}
                                className="date-picker-input"
                            />
                        </div>
                        <div className="dropdown triple-dot">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                aria-expanded="false"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                onClick={handleReset}
                            >
                                <GrPowerReset title="Reset" />
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>

          { stats?.dealsData &&  <div className="right-nav-content-right mt-4"> 
                <div className="status-bx2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h5>Leads</h5>
                            <h3>{parseInt(stats && stats?.totalLeads && stats?.totalLeads[0] && stats?.totalLeads[0]?.totalLeads || 0)  - parseInt(stats?.totalDealCount || 0)}</h3>
                        </div>
                        <img className='cstm-wdth' src={ico1} alt="" />
                    </div>
                    <p className="percent up"><img src={up} alt="" /> <span>+8.34%</span>  last month</p>
                </div>
                {
                    stats?.dealsData && stats?.dealsData?.map((elem) => {
                        return <div className="status-bx2">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h5>{elem?.leadPriorityName}</h5>
                                    <h3>{`$${elem?.totalDealAmount} (${elem?.totalDeals})`}</h3>
                                </div>
                                {

                                }
                                <img className='cstm-wdth' src={elem?.leadPriorityName == "Qualified Leads" ? ico2 : elem?.leadPriorityName == "Demo Scheduled" ? ico3 : elem?.leadPriorityName == "Negotiations Started" ? ico4 : elem?.leadPriorityName == "Deals Awarded" ? ico5 : elem?.leadPriorityName == "Lost" ? ico6 : ico1} alt="" />
                            </div>
                            <p className="percent down"><img src={down} alt="" /> <span>-2.36%</span>  last month</p>
                        </div>
                    })
                }

            </div>}
            </div>
    )
}

export default FilterCardsPerformance