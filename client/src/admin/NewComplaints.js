import React, { useState, useEffect } from "react";
import {
  getTechnicain,
  getAllTechnicain,
  getUser,
  updateComplaint,
} from "./helper/adminapicalls";
import { isAuthenticated } from "../auth";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

export default function NewComplaints({
  complaint,
  setReload = (f) => f,
  reload = undefined,
}) {
  const { user, token } = isAuthenticated();

  const [technician, setTechnician] = useState({});

  const [customer, setCustomer] = useState({});

  const [allTechnicians, setAllTechnicians] = useState([]);

  const [assignedTechnician, setAssignedTechnician] = useState(
    "Assign Technician"
  );

  useEffect(() => {
    getTechnicain(ObjectId(complaint.technician), token).then((data) => {
      setTechnician(data);
    });
    getAllTechnicain(user._id, token).then((data) => {
      if (data.message) return;
      var x = [];
      // eslint-disable-next-line
      data.map((tech, i) => {
        if (tech.role === 1 && tech.lco === user._id.toString()) x.push(tech);
      });
      setAllTechnicians(x);
    });
    getUser(ObjectId(complaint.customer), token).then((data) => {
      setCustomer(data);
    });
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    setAssignedTechnician(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (assignedTechnician !== "Assign Technician") {
      const newOtp = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      getTechnicain(ObjectId(assignedTechnician), token).then((data) => {
        fetch(
          `http://localhost:8000/send-text?recipient=${data.phone}&text=New complaint VC:${complaint.vc} Issue:${complaint.description} Name:${customer.name} Address:${customer.address} Phone:${customer.phone}`
        )
          .then((e) => {
            console.log(e);
          })
          .catch((e) => console.log(e));
      });
      updateComplaint(complaint._id, user._id, token, {
        technician: assignedTechnician,
        otp: newOtp,
      }).then((data) => {
        fetch(
          `http://localhost:8000/send-text?recipient=${customer.phone}&text=Technician assigned for VC:${data.vc} Issue:${data.description} OTP:${data.otp}`
        )
          .then((e) => console.log(e))
          .catch((e) => console.log(e));
        setReload(!reload);
      });
    }
  };

  const isTechnician = () => {
    if (complaint.technician) {
      return (
        <p className="card-text text-success">
          {`Technician assigned: `}{" "}
          <span className="text-dark">
            {`${technician.name}`} (
            <a href={`tel:+${technician.phone}`}>{`${technician.phone}`}</a>)
          </span>
        </p>
      );
    } else {
      return (
        <span>
          <select
            onChange={handleChange}
            className="form-control"
            placeholder="Technician"
          >
            <option>Assign Technician</option>
            {allTechnicians &&
              allTechnicians.map((tech, index) => (
                <option key={index} value={tech._id}>
                  {tech.name}
                </option>
              ))}
          </select>
          <button
            type="submit"
            onClick={onSubmit}
            className="btn btn-info mt-2"
          >
            Assign
          </button>
        </span>
      );
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
          {isTechnician()}
        </div>
      </div>
    </div>
  );
}
