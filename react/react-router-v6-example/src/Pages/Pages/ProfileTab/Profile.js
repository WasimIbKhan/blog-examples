import React from 'react'
import { Link } from 'react-router-dom';
import {
    Outlet
  } from 'react-router-dom';
function Profile() {
    return (
        <div style={{ padding: 20 }}>
          <Link to="edit-profile">Edit Profile</Link>
          <Outlet />
        </div>
      );
}

export default Profile