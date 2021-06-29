import React, { useContext, useEffect, useState } from "react";
import ReactTimeAgo from 'react-time-ago'

// components
import { userContext } from "../../Context/userContext"

import "./dashboard.css"

import axios from "axios";

export default function Dashboard() {
  const { user_context } = useContext(userContext);
  const [USER_CONTEXT, setUSER_CONTEXT] = user_context;
  const [Notice, setNotice] = useState([])
  console.log("from Dashboard USER_CONTEXT : ", USER_CONTEXT);

  const getNotices = () => {
    var data = {
      "collegeid": USER_CONTEXT.collegeid
    }
    var config = {
      method: 'post',
      url: '/studentService/getAllNotices',
      headers: { 'Content-Type': 'application/json' },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log("axios callied from Dashboard component");
        console.log("/getAllNotices => response.data :", response.data);
        setNotice(response.data.Notices);

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
  }

  useEffect(() => {
    getNotices()

  }, [])
  console.log(Notice);
  return (

    <>
      <div className="flex flex-wrap parent">
        <div className="main">
          <h1>{USER_CONTEXT.college} Notice Board</h1>

          <ul className="cards">
            {Notice.map((notice, index) => {
              return (
                <li className="cards_item" key={index}>
                  <div className="card">
                    <div className="card_content">
                      <h2 className="card_title">{notice.notice_type}</h2>
                      <p className="card_text">{notice.data}</p>
                      <p className="made_by">Sticked <ReactTimeAgo date={notice.createdAt} locale="en-US" /></p>

                    </div>
                  </div>
                </li>
              );
            })
            }

          </ul>
        </div>

      </div>

    </>
  );
}
