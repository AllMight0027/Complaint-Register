import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import NewComplaints from "./NewComplaints";
import { isAuthenticated } from "../auth";
import { getUserComplaint, updateAdmin } from "./helper/adminapicalls";
import { withRouter } from "react-router-dom";

const AdminDashboard = ({ history }) => {
  const [complaints, setComplaints] = useState([]);

  const [reload, setReload] = useState(false);

  const [numberNew, setNumberNew] = useState(0);

  const [numberAssigned, setNumberAssigned] = useState(0);

  const { user, token } = isAuthenticated();
  useEffect(() => {
    getUserComplaint(user._id, token)
      .then((data) => {
        var x = [];
        var na = 0;
        var nn = 0;
        // eslint-disable-next-line
        data.map((complaint, i) => {
          if (complaint.lco === user._id.toString()) {
            x.push(complaint);
            if (complaint.technician && complaint.attended === false) {
              na += 1;
            } else if (complaint.attended === false) {
              nn += 1;
            }
          }
        });
        setComplaints(x);
        setNumberAssigned(na);
        setNumberNew(nn);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line
  }, [reload]);

  function myFunction() {
    var checkBox = document.getElementById("toStop");
    if (checkBox.checked === true) {
      console.log("Checked");
      updateAdmin(user._id, token, { stopped: true }).then((e) =>
        console.log(e)
      );
    } else {
      updateAdmin(user._id, token, { stopped: false }).then((e) =>
        console.log(e)
      );
    }
  }

  if (true) {
    console.log("hbefhhes");
    console.log(user.stopped);
    if (user.stopped === true) {
      document.getElementById("toStop").checked = true;
    }
  }

  return (
    <Base title={user.name}>
      <div className="container">
        <div className="row mt-2">
          <h4 className="text-dark p-2 bg-light">New Complaints</h4>
        </div>
        <div className="row mb-2">
          {numberNew === 0 && (
            <div className="col-12 text-center mt-2 mb-2">
              <h3 className="text-warning ml-5">No New Complaints</h3>
            </div>
          )}
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              if (complaint.attended === false && !complaint.technician)
                return (
                  <NewComplaints
                    complaint={complaint}
                    setReload={setReload}
                    reload={reload}
                  />
                );
            })}
        </div>
        <div className="row mt-5">
          <h4 className="text-dark p-2 bg-light">Assigned Complaints</h4>
        </div>
        <div className="row mb-2">
          {numberAssigned === 0 && (
            <div className="col-12 text-center mt-2 mb-2">
              <h3 className="text-warning ml-5">No Pending Complaints</h3>
            </div>
          )}
          {/* eslint-disable-next-line*/}
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              if (complaint.attended === false && complaint.technician)
                return (
                  <NewComplaints
                    complaint={complaint}
                    setReload={setReload}
                    reload={reload}
                  />
                );
            })}
        </div>
        <div className="row mt-5">
          <h4
            className="text-dark p-2 bg-success"
            onClick={() => {
              history.push("/admin/closedcomplaints");
            }}
            style={{ cursor: "pointer", borderRadius: "25px" }}
          >
            View Closed Complaints
          </h4>
        </div>
        <div className="row mt-3">
          <h5 className="text-warning ">Open Register&nbsp;</h5>
          <div className="switch">
            <label>
              <input type="checkbox" id="toStop" onClick={myFunction} />
              <span class="slider round"></span>
            </label>
          </div>
          <h5 className="text-warning ">&nbsp;Close Register</h5>
        </div>
      </div>
    </Base>
  );
};

export default withRouter(AdminDashboard);
