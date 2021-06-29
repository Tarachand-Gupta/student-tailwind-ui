import React, { Component, useContext } from "react";
import ChatBody from "../chatBody/ChatBody";
import Avatar from "./Avatar";
import { conversationContext } from "../../../../Context/conversationContext"
function ChatListItems(props) {
  const { conversation_context } = useContext(conversationContext);
  const [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT] = conversation_context;

  const selectChat = (e) => {
    for (let index = 0; index < e.currentTarget.parentNode.children.length; index++) {
      e.currentTarget.parentNode.children[index].classList.remove("active");
    }
    setCONVERSATION_CONTEXT({ conversationId: props.cId, chatWithUser: props.name, id: props.Id })


    e.currentTarget.classList.add("active");
  };


  return (
    <div
      style={{ animationDelay: `0.${props.animationDelay}s` }}
      onClick={selectChat}
      className={`chatlist__item ${props.active ? props.active : ""} `}
    >
      <Avatar
        image={
          props.image ? props.image : "http://placehold.it/80x80"
        }
      // isOnline={this.props.isOnline}
      />

      <div className="userMeta">
        <p>{props.name}</p>
        <span className="activeTime">32 mins ago</span>
      </div>
    </div>
  );

}
export default ChatListItems;