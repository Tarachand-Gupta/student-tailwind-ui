import React, { useState } from "react";
import "./nav.css";
// import logo from "./../../images/student-logo.svg";




const Nav = () => {
  const [value, setValue] = useState(0);
  return (
    <>
      <div className="nav">

        <div className="nav__blocks">
          {/* <img src={logo}></img> */}
          {/* <br /> */}
        </div>

        {/*
        <div className="nav__blocks"></div> */}
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />


        <div class="floating-nav">

          <a href="/chats"><i class="fa fa-comments" ></i><span>&nbsp;Chats</span></a>
          <hr style={{ color: 'black' }}></hr>
          <a href="/studentattendance"><i class="fad fa-backpack"></i>&nbsp;attendance </a>
          <hr style={{ color: 'black' }}></hr>
          

        </div> */}

      </div>
    </>
  );
};
export default Nav;
