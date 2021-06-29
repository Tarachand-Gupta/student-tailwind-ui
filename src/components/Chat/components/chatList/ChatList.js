import React, { useState, useContext, useEffect, useRef } from "react";
import "./chatList.css";
import ChatListItems from "./ChatListItems";
import Search from "./Search";
import { userContext } from "../../../../Context/userContext"
import { conversationContext } from "../../../../Context/conversationContext"
import axios from "axios";
import { useHistory } from "react-router-dom";


const ChatList = (props) => {
  const { user_context } = useContext(userContext);
  const { conversation_context } = useContext(conversationContext);
  const [search, setSearch] = useState("")
  const searchRef = useRef("")
  //# initializing state as useContext obj instead useState
  const [USER_CONTEXT, setUSER_CONTEXT] = user_context;
  const [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT] = conversation_context;
  const openRoute = useHistory();

  const allChatUsers = [

  ];
  const [allChats, setAllChats] = useState();

  const handleSearchChange = (e) => {
    searchRef.current = e.target.value
  }


  useEffect(() => {
    callAxios();
  }, []);



  function callAxios() {
    //
    // ================ Axios =========Start=========
    const data = JSON.stringify({
      "id": USER_CONTEXT._id

    });
    console.log("chatlist==> id", USER_CONTEXT._id);

    var config = {
      method: 'post',
      url: '/messageAction/getAllChatDetails',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log("axios callied from ChatList component");
        console.log("/getAllChatDetails => response.data :", response.data);
        // setCONVERSATION_CONTEXT(response.data)
        setAllChats(response.data.participentAndIds);
        console.log("allChats state ", allChats);
        //==== changing Route =====
        // openRoute.push("/chats/chatcontent");

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
    // ================ Axios =========End=========
    //
  }




  return (
    <div className="main__chatlist">
      <button className="btn shadow-xl" >
        <i className="fa fa-plus"></i>
        <span>New conversation</span>
      </button>
      <div className="chatlist__heading">
        <h2>Chats</h2>
        <button className="btn-nobg">
          <i className="fa fa-ellipsis-h"></i>
        </button>
      </div>
      <Search />
      <div className="chatlist__items">
        {allChats ? allChats.map((item, index) => {
          return (
            <ChatListItems
              name={item.username}
              key={index}
              Id={item.withUser}
              animationDelay={index + 1}
              active={(index + 1) ? "active" : ""}
              cId={item.conversationId}
              // isOnline={item.isOnline ? "active" : ""}
              image="https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"

              {...props}
            />
          );
        }) : <p>search chat to get started</p>}
      </div>
    </div>
  );
};
export default ChatList;
