import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminRoute from "./auth/AdminRoutes";
import CustomerRoute from "./auth/CustomerRoute";
import TechnicianRoute from "./auth/TechnicianRoute";
import HelpDeskRoute from "./auth/HelpDeskRoute";
import Signin from "./core/Signin";
import Signup from "./customer/Signup";
import Home from "./customer/Home";
import CustomerDetails from "./customer/CustomerDetails";
import AdminDashboard from "./admin/AdminDashboard";
import ManageTechnicians from "./admin/ManageTechnicians";
import AddTechnician from "./admin/AddTechnician";
import AdminDetails from "./admin/AdminDetails";
import TechnicianDetails from "./admin/TechnicianDetails";
import ClosedComplaints from "./admin/ClosedComplaints";
import TechnicianDashboard from "./technician/TechnicianDashboard";
import ForgotPassword from "./core/ForgotPassword";
import ResetPassword from "./core/ResetPassword";
import NotFound from "./core/NotFound";
import Dashboard from "./helpdesk/Dashboard";
import NewComplaint from "./helpdesk/NewComplaint";

export default function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/authentication/reset-password/:token"
            component={ResetPassword}
          />
          <CustomerRoute exact path="/home" component={Home} />
          <CustomerRoute exact path="/my-details" component={CustomerDetails} />
          <AdminRoute
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />
          <AdminRoute
            exact
            path="/admin/technicians"
            component={ManageTechnicians}
          />
          <AdminRoute
            exact
            path="/admin/technicians/add"
            component={AddTechnician}
          />
          <AdminRoute
            exact
            path="/admin/technicians/details/:technicalId"
            component={TechnicianDetails}
          />
          <AdminRoute exact path="/admin/details" component={AdminDetails} />
          <AdminRoute
            exact
            path="/admin/closedcomplaints"
            component={ClosedComplaints}
          />
          <TechnicianRoute
            exact
            path="/technician/dashboard"
            component={TechnicianDashboard}
          />
          <HelpDeskRoute
            exact
            path="/helpdesk/dashboard"
            component={Dashboard}
          />
          <HelpDeskRoute
            exact
            path="/helpdesk/complaint/:userId"
            component={NewComplaint}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
