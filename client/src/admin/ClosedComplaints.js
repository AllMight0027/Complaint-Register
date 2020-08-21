import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth";
import { getUserComplaint } from "./helper/adminapicalls";
import ClosedCards from "./ClosedCards";

export default function ClosedComplaints() {
  const [complaints, setComplaints] = useState([]);

  const { user, token } = isAuthenticated();

  useEffect(() => {
    getUserComplaint(user._id, token)
      .then((data) => {
        var x = [];
        // eslint-disable-next-line
        data.map((complaint, i) => {
          if (complaint.lco === user._id.toString()) {
            x.push(complaint);
          }
        });
        setComplaints(x);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line
  }, []);

  return (
    <Base>
      <div className="container">
        <div className="row">
          <h4 className="text-dark p-2 bg-light">Closed Complaints</h4>
        </div>
        <div className="row mb-2">
          {/* eslint-disable-next-line*/}
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              if (complaint.attended === true) {
                return <ClosedCards complaint={complaint} />;
              }
            })}
        </div>
      </div>
    </Base>
  );
}
