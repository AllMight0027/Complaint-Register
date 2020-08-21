import React, { useEffect, useState } from "react";
import { getUser, updateComplaint } from "../admin/helper/adminapicalls";
import { isAuthenticated } from "../auth";
import { getLco } from "../customer/helper/customerapicalls";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

export default function TechnicianComplaints({
  complaint,
  technician,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [customer, setCustomer] = useState({});

  const [sucess, setSucess] = useState(false);

  const [error, setError] = useState(false);

  const [otp, setOtp] = useState();

  const { user, token } = isAuthenticated();

  const [lco, setLco] = useState({});

  useEffect(() => {
    getUser(ObjectId(complaint.customer), token).then((data) => {
      setCustomer(data);
    });
    getLco(ObjectId(user.lco), token).then((data) => {
      setLco(data);
    });
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    setOtp(event.target.value);
    setError(false);
  };

  const isAttended = (event) => {
    event.preventDefault();
    if (parseInt(otp) !== complaint.otp) {
      setError(true);
    } else {
      fetch(
        `http://localhost:8000/send-text?recipient=${lco.phone}&text= Complaint Closed- VC:${complaint.vc} Issue:${complaint.description} Name:${customer.name} Address:${customer.address} Attended by:${user.name}`
      )
        .then((e) => {
          console.log(e);
        })
        .catch((e) => console.log(e));
      updateComplaint(complaint._id, user._id, token, { attended: true }).then(
        (data) => {
          setTimeout(() => {
            fetch(
              `http://localhost:8000/send-text?recipient=${customer.phone}&text= Complaint Closed- VC:${complaint.vc} Issue:${complaint.description}`
            )
              .then((e) => {
                console.log(e);
              })
              .catch((e) => console.log(e));
          }, 5000);
        }
      );
      setSucess(true);
    }
  };

  return (
    <div className="col-xl-4 col-sm-12 col-md-6 mt-3">
      <div className="card mt-1 h-100">
        <div className="card-body">
          <h6 className="card-title text-dark mt-1">{`Id: ${complaint._id}`}</h6>
          <p className="card-text text-dark">
            {`Customer: ${customer.name}`} (
            <a href={`tel:+${customer.phone}`}>{`${customer.phone}`}</a>)
          </p>
          <p className="card-text text-dark">{`VC No: ${complaint.vc}`}</p>
          <p className="card-text text-dark">{`Issue: ${complaint.description}`}</p>
          <p className="card-text text-dark">{`Address: ${customer.address}`}</p>
          <p className="card-text text-dark">{`Date: ${complaint.createdAt.split(
            "T",
            1
          )}`}</p>
          <div className="row">
            <p
              className="card-text text-danger col-12"
              style={{ display: error ? "" : "none" }}
            >
              Wrong OTP Entered
            </p>
            <div
              className="form-group col-7"
              style={{ display: sucess ? "none" : "" }}
            >
              <input
                className="form-control"
                type="number"
                placeholder="Enter OTP"
                onChange={handleChange}
                autoComplete="on"
              />
            </div>
            <div className="col-5" style={{ display: sucess ? "none" : "" }}>
              <button
                type="submit"
                className="btn btn-info"
                onClick={isAttended}
              >
                Finish
              </button>
            </div>
            <p
              className="card-text text-success col-12"
              style={{ display: sucess ? "" : "none" }}
            >
              Complaint Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
