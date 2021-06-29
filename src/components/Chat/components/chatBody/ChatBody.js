import React, { useState, useContext } from "react";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import UserProfile from "../userProfile/UserProfile";
import { userContext } from "../../../../Context/userContext"
import { conversationContext } from "../../../../Context/conversationContext"
import { Route, Switch, Redirect } from "react-router";
import Dashboard from "views/admin/Dashboard.js";


const ChatBody = (props) => {
  const { conversation_panel_context } = useContext(conversationContext);
  const [CONVERSATION_PANEL_CONTEXT, setCONVERSATION_PANEL_CONTEXT] = conversation_panel_context;
  //=== importing contexts from ContextAPI 
  const { user_context } = useContext(userContext);
  //# initializing state as useContext obj instead useState
  const [USER_CONTEXT, setUSER_CONTEXT] = user_context;
  const _id = USER_CONTEXT._id;
  const _name = USER_CONTEXT.firstname;
  console.log("_id ", _id, " _name ", _name);
  const [chatContentWithUser, setChatContenWithUser] = useState({
    name: "",
    id: "",
    conversationId: ""
  });

  //this method used to update this component's state from its child and grand child components
  const handleChatBodyUpdate = (data) => {
    console.log("handleChatBodyUpdate Called ! data => ", data);
    setChatContenWithUser({
      name: data.chatContentUser.name,
      id: data.chatContentUser.id,
      conversationId: data.chatContentUser.conversationId
    });
  };



  return (
    <div className="">

      {/* <Switch> */}

      {/* <Route path="/admin/chats" exact > */}


      { CONVERSATION_PANEL_CONTEXT.chatlist &&

        <ChatList
          handleChatBodyUpdate={handleChatBodyUpdate}
          {...props}
        />
      }
      {/* </Route> */}

      {/* <Route path="/chats/chatcontent" exact > */}

      { CONVERSATION_PANEL_CONTEXT.chatContent &&
        <ChatContent
          _id={_id}
          _name={_name}
          handleChatBodyUpdate={handleChatBodyUpdate}
          {...props}
        />
      }


      {/* </Route>
        <Redirect from="/" to="/admin/chats" exact />


      </Switch> */}
      {/* <ChatList
        handleChatBodyUpdate={handleChatBodyUpdate}
        {...props}
      />

      {
        CONVERSATION_CONTEXT.conversationId
          ?
          <ChatContent
            _id={_id}
            _name={_name}

            {...props}
          /> : "Select Chat"
      } */}

      {/* <UserProfile
        user={props.user}
        handleChatBodyUpdate={handleChatBodyUpdate}
        {...props}
      /> */}


    </div >
  );
};
export default ChatBody;
