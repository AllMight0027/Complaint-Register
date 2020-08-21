import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth";
import { getUserComplaint, getTechnicain } from "../admin/helper/adminapicalls";
import TechnicianComplaints from "./TechnicianComplaints";

export default function TechnicianDashboard() {
  const { user, token } = isAuthenticated();

  const [complaints, setComplaints] = useState([]);

  const [technician, setTechnician] = useState({});

  const [reload, setReload] = useState(false);

  useEffect(() => {
    getUserComplaint(user._id, token)
      .then((data) => {
        var x = [];
        // eslint-disable-next-line
        data.map((complaint, i) => {
          if (complaint.technician === user._id) {
            x.push(complaint);
          }
        });
        setComplaints(x);
      })
      .catch((e) => console.log(e));
    getTechnicain(user._id, token).then((data) => {
      setTechnician(data);
    });
    // eslint-disable-next-line
  }, [reload]);

  return (
    <Base title={`Technician ${user.name.split(" ", 1)}`}>
      <div className="container">
        <div className="row">
          <h4 className="text-dark p-2 bg-light">New Complaints</h4>
        </div>
        <div className="row mb-2">
          {complaints &&
            // eslint-disable-next-line
            complaints.map((complaint, i) => {
              // eslint-disable-next-line
              if (complaint.attended === false)
                return (
                  <TechnicianComplaints
                    complaint={complaint}
                    setReload={setReload}
                    reload={reload}
                    technician={technician}
                  />
                );
            })}
        </div>
      </div>
    </Base>
  );
}
