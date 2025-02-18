import moment from "moment";
import React from "react";
import convertSecondsToHHMMSS from "../../utils/TotalWorkingTime";
import nodata from "../../assets/nodatafound.png";

const UserReportDetailsTimeSpent = ({ userTimeSpent }) => {
  return (
    <>
      <div className="table-responsive mt-3">
        {
          Object.keys(userTimeSpent).length == 0 ? (
            <div className="no-img">
              <img src={nodata} />
            </div>
          ) : (
            Object.keys(userTimeSpent).length > 0 &&
            Object.keys(userTimeSpent)?.map((each) => {
              return (
                <div>
                  <div className="dash-right-head mt-3">
                    <h4>{moment(each).format("ll") || "N/A"}</h4>
                  </div>
                  <div className="dash-right-bottom">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {/* <th scope="col">Assigned To</th> */}
                          <th scope="col">Time Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td>{moment(each).format("ll") || "N/A"}</td> */}
                          <td>
                            {convertSecondsToHHMMSS(userTimeSpent[each] || 0)}
                          </td>
                          {/* <td></td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )

          //  <table className='table table-bordered'>
          //           <thead>
          //                     <tr>

          //                       <th scope="col">Date </th>

          //                       <th scope="col">Time Spent  </th>

          //                     </tr>
          //                   </thead>

          //                   <tbody>
          //                       {
          //                           Object.keys(userTimeSpent).length>0 && Object.keys(userTimeSpent)?.map((each)=>{
          //                               return <tr>
          //                                   <td>{moment(each).format("ll")||'N/A'}</td>
          //                                   <td>{convertSecondsToHHMMSS(userTimeSpent[each]|| 0)}</td>

          //                               </tr>
          //                           })
          //                       }

          //                   </tbody>

          //       </table>
        }
      </div>
    </>
  );
};

export default UserReportDetailsTimeSpent;
