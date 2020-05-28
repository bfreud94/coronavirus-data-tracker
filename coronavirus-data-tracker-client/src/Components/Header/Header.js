import React, { Component } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

export class Header extends Component {

    render() {
        return (
            <header className="header">Coronavirus Data Tracker
                <br/>
                <Link style={linkStyle} to="/totalDataUSA">Total Data | </Link>
                <Link style={linkStyle} to="/marginalDataUSA">Marginal Data | </Link>
                <Link style={linkStyle} to="/totalStateData">Total State Data | </Link>
                <Link style={linkStyle} to="/marginalStateData">Marginal State Data</Link>
            </header>
        );
    }
}

const linkStyle = {
    color: '#ffffff',
    fontSize: '16px',
    textDecoration: 'none',
    cursor: 'pointer'
}

export default Header;