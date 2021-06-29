import React, { createContext, useState } from 'react'

export const conversationContext = createContext();

export const ConversationContextProvider = props => {
    const [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT] = useState({});

    // const [ALL_CHATS, setALL_CHATS] = useState(initialState)

    return (
        <conversationContext.Provider
            value={
                {
                    conversation_context: [CONVERSATION_CONTEXT, setCONVERSATION_CONTEXT]
                }
            } >
            {props.children}
        </conversationContext.Provider>
    );

}