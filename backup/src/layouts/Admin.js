import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
// import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";

import Settings from "views/admin/Settings.js";
import Attendance from "views/admin/Attendance.js";
import TeacherTakeAttendance from "views/admin/TeacherAttendance.js";
import TeacherViewAttendance from "views/admin/TeacherViewAttendance.js";

import Tables from "views/admin/Tables.js";
import Chat from "../components/Chat/Chat";
import { userContext } from "../Context/userContext"



export default function Admin() {
  const { user_context } = useContext(userContext);
  const [USER_CONTEXT] = user_context;

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 ">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>

            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/chats" exact component={Chat} />
            {(USER_CONTEXT.studentUserType == "Student")
              ?
              <Route path="/admin/giveattendance" exact component={Attendance} />
              :
              <Route path="/admin/takeattendance" exact component={TeacherTakeAttendance} />

            }
            {
              (USER_CONTEXT.studentUserType == "Teacher")
              &&
              <Route path="/admin/viewattendance" exact component={TeacherViewAttendance} />
            }
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Redirect from="/admin" to="/admin/settings" />

          </Switch>
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </>
  );
}
