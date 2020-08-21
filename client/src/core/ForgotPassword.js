import React, { useState } from "react";
import Base from "./Base";
import { forgotPassword } from "../auth";

export default function ForgotPassword() {
  const [phone, setPhone] = useState();
  const handleChange = (event) => {
    setPhone(event.target.value);
    setvalues({ ...values, error: "", success: false });
  };
  const [values, setvalues] = useState({
    error: "",
    success: false,
    loading: false,
  });
  const { error, success, loading } = values;

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, loading: true });
    forgotPassword({ phone }).then((data) => {
      if (data.error) {
        setvalues({ ...values, error: data.error, loading: false });
      } else {
        setvalues({ ...values, success: data.message, loading: false });
      }
    });
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
        {success}
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
      {onError()}
      {onSuccess()}
      {onLoading()}
      <div className="row">
        <div className="col-md-4 offset-sm-4 text-left bg-light p-2">
          <form>
            <div className="form-group">
              <label className="text-dark">
                <b>Phone Number</b>
              </label>
              <input
                value={phone}
                onChange={handleChange}
                className="form-control"
                type="phone"
                autoComplete="on"
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
