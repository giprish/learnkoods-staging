import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileContent = ({ user }) => {
  return (
    <div className="form-inner">
      <h3>Update Profile</h3>

      {/* <!--Login Form--> */}
      <form
        method="post"
        //   onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-group">
          {user?.name !== "" ? null : (
            <>
              <label>full Name</label>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                required
              />
            </>
          )}
        </div>
        <div className="form-group">
          {user?.email !== "" ? null : (
            <>
              <label>Email</label>
              <input type="email" name="email" placeholder="Email" required />
            </>
          )}
        </div>
        <div className="form-group">
          {user?.phone !== "" && user?.phone !== null ? null : (
            <>
              <label>Phone</label>
              <input type="number" name="Phone" placeholder="Phone" required />
            </>
          )}
        </div>
        <div className="form-group">
          {user?.gender !== "" ? null : (
            <>
              <label>Gender</label>
              <input type="text" name="Gender" placeholder="Gender" required />
            </>
          )}
        </div>
        <div className="form-group">
          {user?.institution !== "" ? null : (
            <>
              <label>Institution/Organization</label>
              <input
                type="text"
                name="Organization"
                placeholder="Organization"
                required
              />
            </>
          )}
        </div>
        <div className="form-group">
          {user?.resume_data !== "" ? null : (
            <>
              <label>Resume Data</label>
              <input
                type="text"
                name="resume data"
                placeholder="Resume data"
                required
              />
            </>
          )}
        </div>
        {/* name */}

        {/* password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
          >
            Update Profile
          </button>
        </div>
        {/* Update */}
      </form>
    </div>
  );
};

export default ProfileContent;
