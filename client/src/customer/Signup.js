import React, { useState, useEffect, Fragment } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/index";
import { getAllLco } from "./helper/customerapicalls";

const Signup = () => {
  const [lcos, setLcos] = useState([]);

  const [inputFields, setInputFields] = useState([""]);

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
  }, []);

  const [values, setvalues] = useState({
    name: "",
    phone: "",
    password: "",
    address: "",
    error: "",
    success: false,
    lco: "Select Provider",
    repassword: "",
  });

  const {
    name,
    address,
    phone,
    password,
    error,
    success,
    lco,
    repassword,
  } = values;

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
    if (lco === "Select Provider") {
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
    if (repassword !== password) {
      setvalues({
        ...values,
        error: "Password doesn't match required",
        success: false,
      });
      return;
    }

    signup({ name, address, phone, password, lco, vc: inputFields })
      .then((data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error, success: false });
        } else if (data.message) {
          setvalues({ ...values, error: data.message, success: false });
        } else {
          setvalues({
            ...values,
            name: "",
            phone: "",
            address: "",
            success: true,
            error: "",
            password: "",
            lco: "Select Provider",
          });
          setInputFields([""]);
        }
      })
      .catch((e) => console.log(e));
  };

  const onSuccess = () => (
    <div className="col-md-6 offset-sm-3 text-left">
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        New Account Created. <Link to="/">Log in</Link>
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
      <div className="row" style={{ display: success ? "none" : "" }}>
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
            <div className="form-group mt-3">
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
            <button
              onClick={onSubmit}
              className="btn btn-success btn-block"
              type="submit"
            >
              Submit
            </button>
            <span>
              Already registered? <Link to="/">Signin Here</Link>
            </span>
            <br />
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
};

export default Signup;
