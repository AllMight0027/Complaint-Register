import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { getAllTechnicain, deleteUser } from "./helper/adminapicalls";
import { isAuthenticated } from "../auth";
import { withRouter } from "react-router-dom";
const ManageTechnicians = ({ history }) => {
  const { user, token } = isAuthenticated();

  const [allTechnicians, setAllTechnicians] = useState([]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    getAllTechnicain(user._id, token).then((data) => {
      if (data.message) return;
      var x = [];
      // eslint-disable-next-line
      data.map((tech, i) => {
        if (tech.role === 1 && tech.lco === user._id.toString()) x.push(tech);
      });
      setAllTechnicians(x);
    });
    // eslint-disable-next-line
  }, [reload]);

  const buttonAddTechnician = () => {
    return (
      <button
        className="btn btn-warning mb-4"
        onClick={() => {
          history.push("/admin/technicians/add");
        }}
      >
        Add Technician
      </button>
    );
  };

  return (
    <Base>
      <div className="container">
        {buttonAddTechnician()}
        {allTechnicians &&
          allTechnicians.map((technician, i) => {
            return (
              <div className="row mb-2 offset-md-2">
                <div className="col-md-3  border border-dark bg-white">
                  <h5 className="mt-1">{technician.name}</h5>
                </div>
                <div className="col-md-3 border bg-white border-dark">
                  <a href={`tel:+${technician.phone}`}>
                    <h5 className="mt-1">{technician.phone}</h5>
                  </a>
                </div>
                <div className="col-md-3 bg-white border border-dark">
                  <div className="row">
                    <button
                      className="btn btn-info col-4 btn-sm mt-1 mb-1 ml-4 btn-block"
                      onClick={() => {
                        history.push(
                          `/admin/technicians/details/${technician._id}`
                        );
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger col-4 btn-sm mt-1 mb-1 ml-4 btn-block"
                      onClick={() => {
                        deleteUser(technician._id, token).then((res) => {
                          setReload(!reload);
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Base>
  );
};

export default withRouter(ManageTechnicians);
