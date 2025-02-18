import React from 'react'

const DashboardTeamCard = ({ img, name, count, id }) => {
    return (
        <div className="status-bx2" style={{ backgroundImage: `url(${img})` }}>
            <a href={'/team/projects/' + btoa(id) || '/'}>
                <div className="tp-content">
                    <h5>{name || 'N/A'} Projects</h5>
                    <h3>{count || 0}</h3>
                </div>
            </a>
        </div>
    )
}

export default DashboardTeamCard