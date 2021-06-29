import React, { createContext, useState } from 'react'

export const conversationContext = createContext();

export const ConversationContextProvider = props => {
    const [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT] = useState({});
    const [CONVERSATION_PANEL_CONTEXT, setCONVERSATION_PANEL_CONTEXT] = useState({
        chatlist: true,
        chatContent: false
    });
    // const [ALL_CHATS, setALL_CHATS] = useState(initialState)

    return (
        <conversationContext.Provider
            value={
                {
                    conversation_context: [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT],
                    conversation_panel_context: [CONVERSATION_PANEL_CONTEXT, setCONVERSATION_PANEL_CONTEXT]
                }
            } >
            {props.children}
        </conversationContext.Provider>
    );

}