import React from 'react'
import { NavLink } from 'react-router-dom';
import './Navigation.css';
const Navigation = () => {
    return (
        <header className="main-navigation">
            <div className="main-navigation-logo">
                <h1>EasyEvent</h1>
            </div>
            <nav className="main-naigation-item">
                <ul>
                    <li><NavLink to="/auth">Auth</NavLink> </li>
                    <li><NavLink to="/events">Events</NavLink> </li>
                    <li><NavLink to="/bookings">Bookings</NavLink> </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navigation
