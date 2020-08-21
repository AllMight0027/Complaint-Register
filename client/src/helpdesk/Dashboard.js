import React, { useState } from "react";
import Base from "../core/Base";
import { getUserByPhone, getLco } from "./helper/helpdeskapicalls";
import { isAuthenticated } from "../auth";
import { getUserComplaint } from "../admin/helper/adminapicalls";
import { withRouter } from "react-router-dom";
const ObjectId = require("mongodb").ObjectID;

const Dashboard = ({ history }) => {
  const [values, setvalues] = useState({
    phone: "",
    loading: false,
    error: "",
    success: false,
  });

  const [fetchedUser, setFetchedUser] = useState({});

  const [lco, setLco] = useState({});

  const { phone, loading, error, success } = values;

  const [pending, setPending] = useState([]);

  const { user, token } = isAuthenticated();

  const handleChange = (name) => (event) => {
    return setvalues({
      ...values,
      error: false,
      [name]: event.target.value,
      success: false,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setvalues({ ...values, error: false, loading: true, success: false });
    getUserByPhone(user._id, token, { phone: phone })
      .then((data) => {
        if (data.error) {
          setvalues({ ...values, error: data.error, loading: false });
        } else {
          setvalues({ ...values, success: true, loading: false });
          setFetchedUser(data);
          getLco(ObjectId(data.lco), token).then((data) => {
            setLco(data);
          });
          getUserComplaint(data._id, token)
            .then((data) => {
              var p = [];
              // eslint-disable-next-line
              data.map((complaint, i) => {
                if (complaint.attended === false) {
                  p.push({
                    vc: complaint.vc,
                    technician: complaint.technician,
                  });
                }
              });
              setPending(p);
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
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

  const searchForm = () => {
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
    );
  };

  const userCard = () => {
    return (
      <div
        className="col-xl-4 offset-xl-4 col-sm-12 offset-md-3 col-md-6 mt-3"
        style={{ display: success ? "" : "none" }}
      >
        <div className="card mt-1 h-100">
          <div className="card-body">
            <p className="card-text text-dark">
              {`Customer: ${fetchedUser.name}`} (
              <a href={`tel:+${fetchedUser.phone}`}>{`${fetchedUser.phone}`}</a>
              )
            </p>
            <p className="card-text text-dark">{`Address: ${fetchedUser.address}`}</p>
            <p className="card-text text-dark">{`LCO: ${lco.name}`}</p>

            {pending &&
              // eslint-disable-next-line
              pending.map((complaint, i) => {
                return (
                  <p className="card-text text-dark" key={`~${i}`}>
                    {`Pending Complaint on VC ${complaint.vc}`}{" "}
                    {complaint.technician && (
                      <span> (Technician Assigned)</span>
                    )}
                    {!complaint.technician && (
                      <span> (Technician To Be Assigned)</span>
                    )}
                  </p>
                );
              })}

            <button
              className="btn btn-outline-warning btn-block"
              type="button"
              onClick={() => {
                console.log("FILE KARO NA");
                history.push(`/helpdesk/complaint/${fetchedUser._id}`);
              }}
            >
              File Complaint
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base title="Help Desk">
      {onLoading()}
      {onError()}
      {searchForm()}
      {userCard()}
    </Base>
  );
};

export default withRouter(Dashboard);
