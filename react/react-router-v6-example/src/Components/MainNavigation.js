import React from 'react'
import { Link } from 'react-router-dom';
import classes from './MainNvaigation.module.css';
import {
  NavLink,
  Navigate,
} from 'react-router-dom';
const Navigation = props => {
  const { token, onLogout } = props.auth
  return (
    <header className={classes.header}>
      <div >FDM Timesheets</div>
      <nav className={classes.logo}>
        <ul>
          <li>
            <Link to='schedule'>Schedule</Link>
          </li>
          <li>
            <Link to='profile'>Profile</Link>
          </li>
          <li>
            <Link to='menu'>Menu</Link>
          </li>
          <div onClick={onLogout} className={classes.logout}>
              Logout
          </div>
        </ul>
        
      </nav>
    </header>
  );
}

export default Navigation;