import React from "react";

const ProjectReportTeamCard = ({ img, name, count, id, handleTeamChange,teamId }) => {
  return (
    <div
      className="status-bx2"
      style={{
        cursor:"pointer",
        backgroundImage: `url(${img})`,
        border: `${teamId == id ? "2px solid #54B4D3" : ""}`,
      }}
      onClick={() => handleTeamChange(id)}
    >
      {/* <a href={'/team/projects/' + btoa(id) || '/'}> */}
      <div className="tp-content">
        <h5>{name || "N/A"} Projects</h5>
        <h3>{count || 0}</h3>
      </div>
      {/* </a> */}
    </div>
  );
};

export default ProjectReportTeamCard;
