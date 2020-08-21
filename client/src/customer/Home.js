import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/index";
import {
  getUserComplaint,
  postComplaint,
  getLco,
} from "./helper/customerapicalls";
import PendingComplaints from "./PendingComplaints";
import CompletedComplaints from "./CompletedComplaints";
// eslint-disable-next-line
const ObjectId = require("mongodb").ObjectID;

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [vc, setVc] = useState("Select VC No.");
  const [complaint, setComplaint] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [lco, setLco] = useState({});
  const [pending, setPending] = useState([]);
  const [disable, setDisable] = useState(false);
  const { user, token } = isAuthenticated();
  useEffect(() => {
    getLco(ObjectId(user.lco), token).then((data) => {
      setLco(data);
    });
    getUserComplaint(user._id, token)
      .then((data) => {
        var x = [];
        var p = [];
        // eslint-disable-next-line
        data.map((complaint, i) => {
          if (complaint.customer === user._id) {
            x.push(complaint);
            if (complaint.attended === false) {
              p.push(complaint.vc);
            }
          }
        });
        setComplaints(x);
        setPending(p);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line
  }, [reload]);

  const handleChange = (event) => {
    setError("");
    setComplaint(event.target.value);
    setSuccess(false);
  };

  const handleVC = (event) => {
    setError("");
    setVc(event.target.value);
    setSuccess(false);
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

  const onSuccess = () => (
    <div className="col-md-6 offset-sm-3 text-left">
      <div
        className="alert alert-dark text-success"
        style={{ display: success ? "" : "none" }}
      >
        Complaint Filed Successfully
      </div>
    </div>
  );

  const onSubmit = (event) => {
    event.preventDefault();
    setSuccess(false);
    setLoading(true);
    setDisable(true);
    setError("");
    if (vc === "Select VC No.") {
      setDisable(false);
      setError("VC is required");
      setLoading(false);
      return;
    }
    if (complaint.trim() === "") {
      setDisable(false);
      setError("Description is required");
      setLoading(false);
      return;
    }
    if (pending.indexOf(vc) !== -1) {
      setDisable(false);
      setError("Already a pending complaint on this VC");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8000/send-text?recipient=${lco.phone}&text=New complaint VC:${vc} Issue:${complaint}`
    )
      .then((e) => console.log(e))
      .catch((e) => console.log(e));

    postComplaint(user._id, token, {
      description: complaint,
      lco: user.lco,
      vc: vc,
    })
      .then((data) => {
        setDisable(false);
        if (data.error) {
          setLoading(false);
          setError(data.error);
        } else if (data.message) {
          setLoading(false);
          setError(data.message);
        } else {
          setLoading(false);
          setError("");
          setSuccess(true);
          setComplaint("");
          setReload(!reload);
          setVc("Select VC No.");
        }
      })
      .catch((e) => console.log(e));
  };

  const complaintForm = () => {
    return (
      <div className="row mt-4">
        {onLoading()}
        {onError()}
        {onSuccess()}
        <div className="col-md-6 offset-sm-3 text-left bg-light p-2">
          <form>
            <select
              onChange={handleVC}
              className="form-control"
              placeholder="vc"
              value={vc}
            >
              <option>Select VC No.</option>
              {user.vc &&
                user.vc.map((tech, index) => (
                  <option key={index} value={tech}>
                    {tech}
                  </option>
                ))}
            </select>
            <div className="form-group mt-1">
              <label className="text-dark">Issue Description</label>
              <textarea
                onChange={handleChange}
                className="form-control"
                type="text"
                value={complaint}
                rows="2"
              />
            </div>
            <button
              onClick={onSubmit}
              disabled={disable || lco.stopped}
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

  return (
    <Base title={`Welcome ${user.name.split(" ", 1)}`} stopped={lco.stopped}>
      <div className="container">
        <div className="row">
          <h4 className="text-dark p-2 bg-light">Pending Complaints</h4>
        </div>
        {/* eslint-disable-next-line*/}
        <div className="row mb-2" id="pending">
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              if (complaint.attended === false)
                return (
                  <PendingComplaints complaint={complaint} key={`~${i}`} />
                );
            })}
        </div>
        <div className="row">
          <h4 className="text-dark mt-4 p-2 bg-light">New Complaint</h4>
        </div>
        {complaintForm()}

        <div className="row mt-4">
          <h4 className="text-dark p-2 bg-light">Completed Complaints</h4>
          {/* eslint-disable-next-line*/}
        </div>
        <div className="row mb-2" id="pending">
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              if (complaint.attended === true)
                return (
                  <CompletedComplaints complaint={complaint} key={`~${i}`} />
                );
            })}
        </div>
      </div>
    </Base>
  );
};

export default Home;
