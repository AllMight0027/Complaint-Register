import React, { useState } from "react";
import Base from "./Base";
import { Redirect, Link } from "react-router-dom";
import { authenticate, isAuthenticated, signin } from "../auth/index";

const Signin = () => {
  const [values, setvalues] = useState({
    phone: "",
    password: "",
    loading: false,
    error: "",
    isRedirected: "",
  });

  const { phone, password, loading, error, isRedirected } = values;

  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    return setvalues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, error: false, loading: true });
    signin({ phone, password })
      .then((data) => {
        if (data.message) {
          setvalues({ ...values, error: data.message, loading: false });
        } else if (data.error) {
          setvalues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setvalues({ ...values, isRedirected: true });
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const performRedirect = () => {
    if (isRedirected) {
      if (user && user.role === 2) {
        return <Redirect to="/admin/dashboard" />;
      } else if (user && user.role === 1) {
        return <Redirect to="/technician/dashboard" />;
      } else if (user && user.role === 1.5) {
        return <Redirect to="/helpdesk/dashboard" />;
      } else {
        return <Redirect to="/home" />;
      }
    }
    if (isAuthenticated()) {
      if (user && user.role === 2) {
        return <Redirect to="/admin/dashboard" />;
      } else if (user && user.role === 1) {
        return <Redirect to="/technician/dashboard" />;
      } else if (user && user.role === 1.5) {
        return <Redirect to="/helpdesk/dashboard" />;
      } else {
        return <Redirect to="/home" />;
      }
    }
  };

  const onLoading = () => (
    <div className="col-md-6 offset-sm-3 text-left">
      <div
        className="alert alert-success"
        style={{ display: loading ? "" : "none" }}
      >
        Loading.....
      </div>
    </div>
  );

  const onError = () => (
    <div className="col-md-6 offset-sm-3 text-left">
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    </div>
  );

  const signinForm = () => {
    function myFunction() {
      var x = document.getElementById("password");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    return (
      <div className="row">
        <div className="col-md-4 offset-sm-4 text-left bg-light p-2">
          <form>
            <div className="form-group">
              <label className="text-dark">
                <b>Phone Number</b>
              </label>
              <input
                value={phone}
                onChange={handleChange("phone")}
                className="form-control"
                type="phone"
                autoComplete="on"
              />
            </div>
            <label className="text-dark">
              <b>Password</b>
            </label>
            <div className="form-group row">
              <input
                value={password}
                onChange={handleChange("password")}
                className="form-control col-10 ml-3"
                type="password"
                id="password"
              />
              <span
                if="toggle"
                className="fa fa-fw fa-eye field-icon toggle-password col-1 mt-2"
                title="Show Password"
                onClick={myFunction}
              ></span>
            </div>
            <button
              onClick={onSubmit}
              className="btn btn-success btn-block"
              type="submit"
            >
              Submit
            </button>
            <div className="row">
              <span className="col-sm-6">
                Not registered? <Link to="/signup">Signup Here</Link>
              </span>
              <span className="col-sm-6 text-right">
                <Link to="/forgot-password">Forgot Password?</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base>
      <div className="text-warning text-center">
        <p className="lead">
          <b>Signin here</b>
        </p>
      </div>
      {onLoading()}
      {onError()}
      {signinForm()}
      {performRedirect()}
    </Base>
  );
};

export default Signin;
