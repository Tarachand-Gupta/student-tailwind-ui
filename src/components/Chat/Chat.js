import React from 'react'
import ChatBody from "./components/chatBody/ChatBody"
import Nav from './components/nav/Nav'
import "./Chat.css"
import { Switch, Route, Redirect } from "react-router-dom";

import { ConversationContextProvider } from '../../Context/conversationContext'

const Chat = () => {

    return (
        <ConversationContextProvider>
            <div className="">



                <ChatBody />


            </div>
        </ConversationContextProvider>

    )


}
export default Chat;