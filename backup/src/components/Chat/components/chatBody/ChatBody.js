import React, { useState, useContext } from "react";
import "./chatBody.css";
import ChatList from "../chatList/ChatList";
import ChatContent from "../chatContent/ChatContent";
import UserProfile from "../userProfile/UserProfile";
import { userContext } from "../../../../Context/userContext"
import { conversationContext } from "../../../../Context/conversationContext"


const ChatBody = (props) => {
  const { conversation_context } = useContext(conversationContext);
  const [CONVERSATION_CONTEXT] = conversation_context;
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
    <div className="main__chatbody">

      <ChatList
        handleChatBodyUpdate={handleChatBodyUpdate}
        {...props}
      />

      {
        CONVERSATION_CONTEXT.conversationId
          ?
          <ChatContent
            _id={_id}
            _name={_name}
            chatContentWithUser={chatContentWithUser}
            handleChatBodyUpdate={handleChatBodyUpdate}
            {...props}
          /> : "Select Chat"
      }

      {/* <UserProfile
        user={props.user}
        handleChatBodyUpdate={handleChatBodyUpdate}
        {...props}
      /> */}


    </div >
  );
};
export default ChatBody;
