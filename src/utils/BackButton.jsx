import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ name, url }) => {
    const nav = useNavigate()
    return (
        <button className="btn modal-save-btn" onClick={() => nav(url)}>Back To {name}</button>
    )
}

export default BackButton