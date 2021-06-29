import React, { createContext, useState } from 'react'

export const userContext = createContext();

export const UserContextProvider = props => {
    const [USER_CONTEXT, setUSER_CONTEXT] = useState({ firstname: 'test' });
    const [POST_CONTEXT, setPOST_CONTEXT] = useState({});
    const [MESSAGE_CONTEXT, setMESSAGE_CONTEXT] = useState({});
    // const [ALL_CHATS, setALL_CHATS] = useState(initialState)

    return (
        <userContext.Provider
            value={
                {
                    user_context: [USER_CONTEXT, setUSER_CONTEXT],
                    post_context: [POST_CONTEXT, setPOST_CONTEXT],
                    message_context: [MESSAGE_CONTEXT, setMESSAGE_CONTEXT]
                }
            } >
            {props.children}
        </userContext.Provider>
    );

}

// Provider accepts passing any value so you can paas object here and your values as properties.

// <GameContext.Provider
//  value={{ name: [name, setName], color: [color, setColor] }}
//    >
//   {props.children}
// </GameContext.Provider>;

// and where you are accessing in Child

//  const { name, color } = React.useContext(GameContext);
//  const [nameValue, setnameValue] = name;
//  const [colorValue, setcolorValue] = color;