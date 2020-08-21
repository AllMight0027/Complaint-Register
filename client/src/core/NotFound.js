import React from "react";
import Base from "./Base";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Base title="404: Page Not Found">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-warning">
              <h1 class="display-4">
                Return to{" "}
                <Link to="/" className="text-light">
                  Home
                </Link>
              </h1>
            </p>
          </div>
        </div>
      </div>
    </Base>
  );
}
