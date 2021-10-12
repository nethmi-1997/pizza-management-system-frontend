import React, { Component } from 'react';
import authService from '../Services/AuthService';
import { Redirect } from 'react-router-dom';

function Header({ authorized }) {
    const user = authService.getCurrentUser();

    if (!authorized) {
        return <Redirect to="/login" />
    }

    const logOut = () => {
        authService.logout();
        window.location.reload();
    };

    return (
        <div className="Header">
            <div className="HeaderLeft">
                <img className="logo" src="logoHOAD.png"/>
            </div>
            <div className="HeaderRight">
                <p>
                    @{user != null && user.username}
                </p>
                <div>
                    {user != null && user.roles[0] === "ROLE_ADMIN" && <p>Admin</p>}
                    {user != null && user.roles[0] === "ROLE_MANAGER" && <p>Manager</p>}
                    {user != null && user.roles[0] === "ROLE_CASHIER" && <p>Cashier</p>}
                    {user != null && user.roles[0] === "ROLE_DELIVERY" && <p>Delivery</p>}
                </div>
                <button 
                    onClick={logOut}
                >
                    LOG OUT
                </button>
            </div>
        </div>
    )
}

export default Header;