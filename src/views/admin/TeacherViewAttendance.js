import React, { useContext, useEffect, useRef, useState } from "react";
// import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import "./TeacherMarkAttendance.css"
// components
import { userContext } from "../../Context/userContext"


import axios from "axios";

export default function TeacherViewAttendance() {

    //Context
    const { user_context } = useContext(userContext);
    const [USER_CONTEXT] = user_context;

    //States
    const [showAttendance, setShowAttendance] = useState(false)
    const [status, setStatus] = useState("")
    const [responses, setResponses] = useState([])
    const [responseUser, setResponseUser] = useState([{
        "fullname": "No user",
        "userid": "NA"
    }])

    const daytRef = useRef("");
    const onDayStateChange = (e) => { daytRef.current = e.target.value }

    const monthRef = useRef("");
    const onMonthStateChange = (e) => { monthRef.current = e.target.value }

    const yearRef = useRef("");
    const onYearStateChange = (e) => { yearRef.current = e.target.value }

    const validateAndFetch = (e) => {
        e.preventDefault();
        fetchAttendance();
    }

    const fetchAttendance = () => {



        //
        // ================ Axios =========Start=========
        const data = JSON.stringify({

            "teacherid": USER_CONTEXT._id,
            "day": daytRef.current,
            "month": monthRef.current,
            "year": yearRef.current,

        });

        var config = {
            method: 'post',
            url: '/teacherAction/viewAttendanceResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log("axios callied from /viewAttendanceResponses TeacherViewAttendance component response => ", response);
                if (!response.data.failed) {
                    setStatus("Attendance Fetched !")
                    console.log("response.data", response.data);
                    setResponses(response.data)
                    setShowAttendance(true)
                }
                else {
                    setStatus("No Attendance Record Found !")
                }


                // setStatus("Attendance Fetched ! ")

                // console.log("Responses state ", responses);



            })
            .catch(function (error) {
                setStatus("Server Error " + error)
                console.log(JSON.stringify(error));
            });
        // ================ Axios =========End=========
        //
        // setTimeout(setError, 10000)
    }


    useEffect(() => {
        console.log("from Attendance USER_CONTEXT : ", USER_CONTEXT);
    }, [USER_CONTEXT])


    return (
        <>

            <div className="flex flex-wrap">
                <div className="w-full mt-5 py-5 rounded-lg shadow-2xl xl:w-12/12 mb-12 xl:mb-0 px-4">
                    <h1 className=" uppercase text-blueGray-600 text-xl font-bold mb-2" > View Attendance </h1>
                    <div className="flex flex-wrap">
                        {/* Date */}
                        <div className="w-full relative px-4">
                            <div className="relative xl:w-12/12 w-full mb-3">
                                <label
                                    className="  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Enter Date
                                </label>
                                <input
                                    type="text"
                                    required
                                    pattern="[0-9]+"
                                    maxLength="2"
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Date 1 - 31"
                                    onChange={onDayStateChange}
                                />
                            </div>
                        </div>
                        {/* Month */}
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label
                                    className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Enter Month
                                    </label>
                                <input
                                    type="text"
                                    required
                                    pattern="[0-9]+"
                                    maxLength="2"
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Time Slot"
                                    onChange={onMonthStateChange}
                                />
                            </div>
                        </div>
                        {/* Year */}
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label
                                    className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Enter Year
                                    </label>
                                <input
                                    type="text"
                                    required
                                    pattern="[0-9]+"
                                    maxLength="4"
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Time Slot"
                                    onChange={onYearStateChange}
                                />
                            </div>
                        </div>
                        {/* Fetch Button */}
                        <div className="w-md lg:w-12/12 px-4">
                            <div className="">
                                <button
                                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={validateAndFetch}
                                >
                                    Fetch Attendance
                                    </button>
                            </div>
                        </div>
                        {/* Status */}
                        <div className="w-md lg:w-12/12 px-4">
                            <h1 className="block uppercase text-red text-md font-bold " > {status}</h1>

                        </div>

                        {/* List component */}

                        <div className="w-full lg:w-12/12 px-4">



                            <div>
                                {
                                    responses.map((attendance) => {
                                        return (


                                            <div className="w-md rounded-lg shadow-2xl mt-6 mb-6 lg:w-12/12 px-4">
                                                <div class="dark-list">
                                                    <h3> Subject : {attendance.subject}</h3>

                                                    <ul>
                                                        {
                                                            attendance.attendances.map((user, index) => {

                                                                return (

                                                                    <li key={user.userid}>
                                                                        {user.fullname}
                                                                    </li>

                                                                );
                                                            })

                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        )

                                    })
                                }





                            </div>




                        </div>



                    </div>
                </div>
            </div>
        </>
    );
}
