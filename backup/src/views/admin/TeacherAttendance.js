import React, { useContext, useEffect, useRef, useState } from "react";

// components
import { userContext } from "../../Context/userContext"
import TeacherMarkAttendance from './TeacherMarkAttendance'

import axios from "axios";

export default function TeacherAttendance() {
    const { user_context } = useContext(userContext);

    const [USER_CONTEXT, setUSER_CONTEXT] = user_context;


    const [mountMarkAttendance, setMountMarkAttendance] = useState(false)
    const [status, setStatus] = useState("")

    const [Data, setData] = useState({})

    const subjectRef = useRef("");
    const onsubjectStateChange = (e) => { subjectRef.current = e.target.value }
    const timeSlotRef = useRef("");
    const onTimeSlotStateChange = (e) => { timeSlotRef.current = e.target.value }

    const takeAttendance = () => {

        const code = Math.floor(100000 + Math.random() * 900000)
        //
        // ================ Axios =========Start=========
        const data = JSON.stringify({

            "teacherid": USER_CONTEXT._id,
            "timeslot": timeSlotRef.current,
            "subject": subjectRef.current,
            "code": code
        });

        var config = {
            method: 'post',
            url: '/teacherAction/takeAttendance',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log("axios callied from /takeAttendance TeacherAttendance component response => ", response);
                setTimeout(500);

                setStatus("Attendance Code : " + response.data.code)
                setData(response.data)
                setMountMarkAttendance(true)

            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
        // ================ Axios =========End=========
        //
        // setTimeout(setError, 10000)
    }

    useEffect(() => {

    }, [status])

    useEffect(() => {
        console.log("from Attendance USER_CONTEXT : ", USER_CONTEXT);
    }, [USER_CONTEXT])




    return (
        <>

            <div className="flex flex-wrap">
                <div className="w-full mt-5 py-5 rounded-lg shadow-2xl xl:w-8/12 mb-12 xl:mb-0 px-4">
                    <h1 className="block uppercase text-blueGray-600 text-xl font-bold mb-2" > Take Attendance </h1>
                    <div className="flex flex-wrap">

                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label
                                    className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Enter Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Enter Subject"
                                    onChange={onsubjectStateChange}
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label
                                    className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Time Slot
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Time Slot"
                                    onChange={onTimeSlotStateChange}
                                />
                            </div>
                        </div>

                        <div className="w-md lg:w-12/12 px-4">
                            <div className="">
                                <button
                                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={takeAttendance}
                                >
                                    Generate Code
                                    </button>
                            </div>
                        </div>

                        <div className="w-md lg:w-12/12 px-4">
                            <h1 className="block uppercase text-red text-md font-bold " > {status}</h1>
                        </div>
                        <div className="w-full lg:w-12/12 px-4">
                            {mountMarkAttendance ?

                                <TeacherMarkAttendance
                                    attendanceData={Data}
                                />
                                :
                                <p> click Refresh List to see Attendance </p>

                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
