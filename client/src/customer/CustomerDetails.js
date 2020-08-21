import React, { useState, useEffect, Fragment } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated, signout } from "../auth/index";
import { updateCustomer, getAllLco } from "./helper/customerapicalls";

export default function CustomerDetails() {
  const { user, token } = isAuthenticated();
  const [lcos, setLcos] = useState([]);
  const [inputFields, setInputFields] = useState(user.vc);

  useEffect(() => {
    getAllLco().then((data) => {
      var x = [];
      // eslint-disable-next-line
      data.map((lco, i) => {
        if (lco.role === 2) {
          x.push(lco);
        }
      });
      setLcos(x);
    });
    console.log(user);
    // eslint-disable-next-line
  }, []);
  const [values, setvalues] = useState({
    name: user.name,
    phone: user.phone,
    password: "",
    address: user.address,
    error: "",
    success: false,
    lco: user.lco,
  });

  const { name, address, phone, lco, error, success } = values;

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
    setvalues({ ...values, error: false });
    var flag = false;
    // eslint-disable-next-line
    inputFields.map((inp, i) => {
      if (inp.trim() === "") {
        flag = true;
        setvalues({ ...values, error: "Empty VC field", success: false });
        // eslint-disable-next-line
        return;
      }
    });
    if (flag) {
      console.log("OOPS");
      return;
    }
    if (lco === "Select Provider" || lco === undefined) {
      setvalues({
        ...values,
        error: "Service Provider is required",
        success: false,
      });
      return;
    }
    if (address.trim() === "") {
      setvalues({ ...values, error: "Address is required", success: false });
      return;
    }
    if (name.trim() === "") {
      setvalues({ ...values, error: "Name is required", success: false });
      return;
    }
    updateCustomer(user._id, token, {
      name,
      address,
      phone,
      lco,
      vc: inputFields,
    })
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
          signout(() => {});
        }
      })
      .catch((e) => console.log(e));
  };

  const onReset = (event) => {
    event.preventDefault();
    setvalues({
      ...values,
      name: user.name,
      phone: user.phone,
      address: user.address,
      error: "",
      lco: user.lco,
    });
    setInputFields(user.vc);
  };

  const onSuccess = () => {
    return (
      <div className="col-md-6 offset-sm-3 text-left">
        <div
          className="alert alert-success"
          style={{ display: success ? "" : "none" }}
        >
          Account Updated. Please <Link to="/">Log in</Link> Again
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

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index] = event.target.value;
    setInputFields(values);
  };

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push("");
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const signupForm = () => {
    return (
      <div className="row" style={{ display: !success ? "" : "none" }}>
        <div className="col-md-6 offset-sm-3 text-left bg-light p-2">
          <form>
            <select
              onChange={handleChange("lco")}
              className="form-control"
              placeholder="LCO"
              value={lco}
            >
              <option>Select Provider</option>
              {lcos &&
                lcos.map((tech, index) => (
                  <option key={index} value={tech._id}>
                    {tech.name}
                  </option>
                ))}
            </select>
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
            <div className="form-group">
              <label className="text-dark">Address</label>
              <textarea
                onChange={handleChange("address")}
                className="form-control"
                type="text"
                value={address}
                rows="2"
              />
            </div>
            <div className="row">
              {inputFields.map((inputField, index) => (
                <Fragment key={`${index}`}>
                  <div className="form-group col-md-4">
                    <label htmlFor="vc">VC No.</label>
                    <input
                      type="text"
                      className="form-control"
                      value={inputField}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </div>
                  <div className="form-group col-sm-2">
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleRemoveFields(index)}
                      style={{ display: index === 0 ? "none" : "" }}
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAddFields()}
                      className="btn btn-info ml-2"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </Fragment>
              ))}
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
      {onError()}
      {onSuccess()}
      {signupForm()}
    </Base>
  );
}
