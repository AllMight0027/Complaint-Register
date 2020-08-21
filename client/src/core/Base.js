import React from "react";
import { isAuthenticated, signout } from "../auth";
import { withRouter } from "react-router-dom";

const Base = ({
  title = "",
  description = "",
  className = "text-dark p-4",
  children,
  history,
  stopped = false,
}) => (
  <div>
    <div className="container-fluid">
      <div className="row bg-white">
        <div className="col-8">
          <img
            title="Home"
            src={require("./denlogo.jpg")}
            alt="DEN LOGO"
            style={{ maxHeight: "75px", cursor: "pointer" }}
            onClick={() => {
              if (isAuthenticated()) {
                var role = isAuthenticated().user.role;
                if (role === 0) {
                  history.push("/home");
                }
                if (role === 1) {
                  history.push("/technician/dashboard");
                }
                if (role === 1.5) {
                  history.push("/helpdesk/dashboard");
                }
                if (role === 2) {
                  history.push("/admin/dashboard");
                }
              } else {
                console.log("no");
                history.push("/");
              }
            }}
          />
        </div>
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <div className="col-4 text-right pt-3">
            <i
              title="My Details"
              className="fa fa-user pr-4"
              aria-hidden="true"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                history.push("/my-details");
              }}
            ></i>
            <i
              title="Signout"
              className="fa fa-sign-out pl-2"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            ></i>
          </div>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 1.5 && (
          <div className="col-4 text-right pt-3">
            <i
              title="Signout"
              className="fa fa-sign-out pl-2"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            ></i>
          </div>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 2 && (
          <div className="col-4 text-right pt-3">
            <i
              title="My Technician"
              className="fa fa-users pr-4"
              aria-hidden="true"
              style={{ fontSize: "37px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                history.push("/admin/technicians");
              }}
            ></i>
            <i
              title="My Details"
              className="fa fa-user pr-4"
              aria-hidden="true"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                history.push("/admin/details");
              }}
            ></i>
            <i
              title="Signout"
              className="fa fa-sign-out pl-2"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            ></i>
          </div>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <div className="col-4 text-right pt-3">
            <i
              title="Signout"
              className="fa fa-sign-out pl-2"
              style={{ fontSize: "40px", color: "danger", cursor: "pointer" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            ></i>
          </div>
        )}
      </div>
      <div className="row" style={{ display: stopped ? "" : "none" }}>
        <div class="wrapper">
          <p className="lead p-2 text-white" style={{ fontSize: "40px" }}>
            Hey, how you're doing? Sorry you can't get through.
          </p>
        </div>
      </div>
      <div
        className="text-warning text-center mt-4 p-4"
        style={{ backgroundColor: "#c41018" }}
      >
        <h2 className="display-4">
          <b>{title}</b>
        </h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
    <br />
    <br />
    <footer
      className="footer mt-auto py-3"
      style={{ backgroundColor: "#f98f16" }}
    >
      <div
        className="container-fluid text-dark text-center py-3"
        style={{ backgroundColor: "#f98f16" }}
      >
        <h5>Click to reach out</h5>
        {/* eslint-disable-next-line*/}
        <a
          href="mailto: AllMight0027@gmail.com"
          className="btn btn-sm btn-info text-dark"
          data-toggle="button"
          aria-pressed="false"
          autoComplete="off"
        >
          Contact US
        </a>
      </div>
    </footer>
  </div>
);

export default withRouter(Base);
