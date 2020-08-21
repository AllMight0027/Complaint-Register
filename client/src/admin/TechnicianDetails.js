import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import { updateAdmin, getTechnicain } from "./helper/adminapicalls";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

const TechnicianDetails = ({ match, history }) => {
  const { user, token } = isAuthenticated();
  const [data, setuser] = useState({});
  const [values, setvalues] = useState({
    name: data.name,
    phone: data.phone,
    error: "",
    success: false,
  });
  useEffect(() => {
    getTechnicain(ObjectId(match.params.technicalId), token).then((data) => {
      if (data.message) return;
      if (data.error) return;
      setuser(data);
      setvalues({
        ...values,
        name: data.name,
        phone: data.phone,
      });
    });
    // eslint-disable-next-line
  }, []);

  const { name, phone, error, success } = values;

  const goback = () => {
    return (
      <button
        className="btn btn-warning mb-4 offset-sm-2"
        onClick={() => {
          history.push("/admin/technicians");
        }}
      >
        Back
      </button>
    );
  };

  const handleChange = (name) => (event) => {
    return setvalues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, error: false });
    if (name.trim() === "") {
      setvalues({ ...values, error: "Name is required", success: false });
      return;
    }
    updateAdmin(data._id, token, { name, phone, lco: user._id })
      .then((data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error, success: false });
        } else if (data.message) {
          setvalues({ ...values, error: data.message, success: false });
        } else {
          setvalues({
            ...values,
            success: true,
            error: "",
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const onReset = (event) => {
    event.preventDefault();
    setvalues({
      ...values,
      name: data.name,
      phone: data.phone,
      error: "",
    });
  };

  const onSuccess = () => {
    return (
      <div className="col-md-6 offset-sm-3 text-left">
        <div
          className="alert alert-success"
          style={{ display: success ? "" : "none" }}
        >
          Technician Details Updated.
        </div>
      </div>
    );
  };

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

  const signupForm = () => {
    return (
      <div className="row" style={{ display: !success ? "" : "none" }}>
        <div className="col-md-6 offset-sm-3 text-left bg-light p-2">
          <form>
            <div className="form-group">
              <label className="text-dark">Name</label>
              <input
                onChange={handleChange("name")}
                className="form-control"
                type="text"
                value={name}
              />
            </div>
            <div className="form-group">
              <label className="text-dark">Phone No.</label>
              <input
                onChange={handleChange("phone")}
                className="form-control"
                type="phone"
                value={phone}
              />
              <small id="phoneHelp" className="form-text text-muted">
                We'll never share your phone number with anyone else.
              </small>
            </div>

            <div className="row">
              <button
                onClick={onSubmit}
                className="btn btn-success  col-3 ml-4"
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={onReset}
                className="btn btn-info  col-3 ml-2"
                type="submit"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  return (
    <Base>
      {goback()}
      {onError()}
      {onSuccess()}
      {signupForm()}
    </Base>
  );
};

export default withRouter(TechnicianDetails);
