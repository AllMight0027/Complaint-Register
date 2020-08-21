import React, { useState, useEffect } from "react";
import { getLco } from "./helper/customerapicalls";
import { isAuthenticated } from "../auth";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

export default function PendingComplaints({ complaint }) {
  const { token } = isAuthenticated();

  const [lco, setLco] = useState({});
  useEffect(() => {
    getLco(ObjectId(complaint.lco), token).then((data) => {
      setLco(data);
    });
    // eslint-disable-next-line
  }, []);

  const isTechnician = () => {
    if (complaint.technician) {
      return (
        <p className="card-text text-success">
          {`Technician assigned`}{" "}
          <span className="text-dark">OTP: {complaint.otp}</span>{" "}
          <i
            class="fa fa-question-circle text-info"
            title="Provide this to technician when problem is solved"
            aria-hidden="true"
          ></i>
        </p>
      );
    } else {
      return (
        <p className="card-text text-danger">{`Technician to be assigned`}</p>
      );
    }
  };
  return (
    <div className="col-xl-4 col-sm-12 col-md-6 mt-3">
      <div className="card mt-1 h-100">
        <div className="card-body">
          <h6 className="card-title text-dark mt-1">{`Id: ${complaint._id}`}</h6>
          <p className="card-text text-dark">{`VC No: ${complaint.vc}`}</p>
          <p className="card-text text-dark">{`Issue: ${complaint.description}`}</p>
          <p className="card-text text-dark">{`Provider: ${lco.name}`}</p>
          <p className="card-text text-dark">{`Date: ${complaint.createdAt.split(
            "T",
            1
          )}`}</p>
          {isTechnician()}
        </div>
      </div>
    </div>
  );
}
