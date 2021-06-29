
import React, { useContext, useRef } from 'react'
import axios from 'axios';
import { userContext } from "../../../../Context/userContext"

const Search = () => {

    const { user_context } = useContext(userContext);
    const [USER_CONTEXT, setUSER_CONTEXT] = user_context;

    const searchRef = useRef("")
    const handleSearchChange = (e) => { searchRef.current = e.target.value }

    const startNewConversation = () => {

        const data = JSON.stringify({

            "userId": USER_CONTEXT._id,
            "username": USER_CONTEXT.firstname,
            "withUsername": searchRef.current

        });
        //console.log("chatlist==> id", USER_CONTEXT._id);

        var config = {
            method: 'post',
            url: '/messageAction/addToConversationDictTemp',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log("axios callied from Search component");
                console.log("/addToConversationDict => response.data :", response.data);
                // setCONVERSATION_CONTEXT(response.data)


                //==== changing Route =====
                //openRoute.push("/admin/dashboard");

            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });


    }



    return (
        <div className="chatList__search">
            <div className="search_wrap">
                <input
                    type="text"
                    placeholder="Search Here"
                    required
                    onChange={handleSearchChange}
                />
                <button className="search-btn" onClick={startNewConversation} >
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </div>
    );
};
export default Search;