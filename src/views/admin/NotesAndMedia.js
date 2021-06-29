import React, { useContext, useRef, useState } from "react";

// components
import { userContext } from "../../Context/userContext"


import axios from "axios";

export default function NotesAndMedia() {
    const { user_context } = useContext(userContext);
    const [USER_CONTEXT, setUSER_CONTEXT] = user_context;
    const ScopeRef = useRef("");

    const onScopeStateChange = (e) => {
        ScopeRef.current = e.target.value
    }
    const [status, setStatus] = useState("")

    const getMedia = () => {
        if (ScopeRef.current === "") {
            setStatus("Please select Scope !")
            return ""
        } else {
            setStatus("Wait ! sending attendance to server !!")
            //
            // ================ Axios =========Start=========
            const data = JSON.stringify({
                "scope": ScopeRef.current,
                "userid": USER_CONTEXT._id,
                "fullname": USER_CONTEXT.firstname + " " + USER_CONTEXT.lastname,
            });

            var config = {
                method: 'post',
                url: '/globalService/getMediaMessages',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log("axios callied from /giveAttendance Attendance component");
                    setTimeout(500);
                    (response.data.failed)
                        ?
                        setStatus("Attendance is not Active")
                        :
                        setStatus("Your attendance request sent  to teacher !")

                    console.log("response.data.user", response.data.status);

                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                });
            // ================ Axios =========End=========
            //
            // setTimeout(setError, 10000)
        }
    }

    // const setError = () => {
    //     setStatus("Timeout ! there is a problem with you")
    // }

    console.log("from Attendance USER_CONTEXT : ", USER_CONTEXT);


    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full mt-5 py-5 rounded-lg shadow-2xl xl:w-12/12 mb-12 xl:mb-0 px-4">
                    <h1 className="block uppercase text-blueGray-600 text-xl font-bold mb-2" > Notes and Media </h1>
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label
                                    className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Select Scope
                                </label>
                                <input

                                    type="text"
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Scope"
                                    onChange={onScopeStateChange}

                                />
                            </div>
                        </div>

                        <div className="w-md lg:w-12/12 px-4">
                            <div className="">
                                <button
                                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={getMedia}
                                >
                                    Get Notes
                                </button>
                            </div>
                        </div>
                        <h1 className="block uppercase text-red text-md font-bold mt-6" > {status}</h1>
                    </div>
                </div>
            </div>
        </>
    );
}
