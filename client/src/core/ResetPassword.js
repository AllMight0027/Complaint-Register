import React, { useState } from "react";
import Base from "./Base";
import { Link } from "react-router-dom";
import { resetPassword } from "../auth";

export default function ResetPassword({ match }) {
  const [values, setvalues] = useState({
    password: "",
    error: "",
    success: false,
    repassword: "",
    loading: false,
  });
  const { password, error, success, repassword, loading } = values;
  const handleChange = (name) => (event) => {
    return setvalues({
      ...values,
      error: false,
      success: false,
      [name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, loading: true });
    setvalues({ ...values, error: false });
    if (repassword !== password) {
      setvalues({
        ...values,
        error: "Password doesn't match",
        success: false,
      });
      return;
    } else {
      resetPassword({
        newPassword: password,
        resetLink: match.params.token,
      }).then((data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error, loading: false });
        } else {
          setvalues({ ...values, success: data.message, loading: false });
        }
      });
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
  const onSuccess = () => (
    <div className="col-md-6 offset-sm-3 text-left">
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        Password Updated. <Link to="/">Log in</Link>
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

  return (
    <Base>
      {onLoading()}
      {onError()}
      {onSuccess()}
      <div className="row" style={{ display: success ? "none" : "" }}>
        <div className="col-md-4 offset-sm-4 text-left bg-light p-2">
          <form>
            <div className="form-group">
              <label className="text-dark">Password</label>
              <input
                onChange={handleChange("password")}
                className="form-control"
                type="password"
                value={password}
              />
            </div>
            <div className="form-group">
              <label className="text-dark">Re Enter Password</label>
              <input
                onChange={handleChange("repassword")}
                className="form-control"
                type="password"
                value={repassword}
              />
            </div>

            <button
              onClick={onSubmit}
              className="btn btn-success btn-block"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Base>
  );
}
