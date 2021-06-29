import React from 'react'
import ChatBody from "./components/chatBody/ChatBody"
import Nav from './components/nav/Nav'
import "./Chat.css"
import { ConversationContextProvider } from '../../Context/conversationContext'

const Chat = () => {

    return (
        <ConversationContextProvider>
            <div className="__main">
                <Nav />
                <ChatBody />
            </div>
        </ConversationContextProvider>

    )

}
export default Chat;