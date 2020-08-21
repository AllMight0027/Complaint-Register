import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { getTechnicain, getUser } from "./helper/adminapicalls";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

export default function ClosedCards({ complaint }) {
  const [technician, setTechnician] = useState({});

  const [customer, setCustomer] = useState({});

  const { token } = isAuthenticated();
  useEffect(() => {
    console.log(complaint);
    getUser(ObjectId(complaint.customer), token).then((data) => {
      setCustomer(data);
    });
    getTechnicain(ObjectId(complaint.technician), token).then((data) => {
      setTechnician(data);
    });
    // eslint-disable-next-line
  }, []);

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
          <p className="card-text text-dark">
            {`Attended by: ${technician.name}`} (
            <a href={`tel:+${technician.phone}`}>{`${technician.phone}`}</a>)
          </p>
          <p className="card-text text-dark">{`Filed on: ${complaint.createdAt.split(
            "T",
            1
          )}`}</p>
          <p className="card-text text-dark">{`Closed on: ${complaint.updatedAt.split(
            "T",
            1
          )}`}</p>
        </div>
      </div>
    </div>
  );
}
