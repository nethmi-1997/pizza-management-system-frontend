import React, { useState, useEffect } from 'react'
import userService from '../Services/UserService';

function ReportsUsers() {
    const [content, setContent] = useState("");

    useEffect(() => {
        userService.getUserReports().then(
            response => {
                setContent(response.data);
            },
            error => {
                setContent(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    return (
        <div className="BodyWindow">
            <h1>{content}</h1>
        </div>
    )
}

export default ReportsUsers
