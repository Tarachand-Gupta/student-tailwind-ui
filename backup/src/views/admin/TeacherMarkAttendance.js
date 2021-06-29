import axios from 'axios'
import React, { useContext, useState } from 'react'
import "./TeacherMarkAttendance.css"
const TeacherMarkAttendance = (props) => {
    const propsData = props.attendanceData
    const [Status, setStatus] = useState("")
    const [responseUser, setResponseUser] = useState([
        {
            "fullname": "No user responded !",
            "userid": "NA"
        }
    ]
    )


    const RefreshList = () => {

        const data = JSON.stringify({

            "teacherid": propsData.teacherid,
            "code": propsData.code
        });

        var config = {
            method: 'post',
            url: '/teacherAction/getAttendanceResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log("axios callied from /takeAttendance TeacherAttendance component response => ", response);
                setTimeout(500);

                setResponseUser(response.data.attendances)
                setStatus("")


            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
    }

    const submitAttendance = () => {

        const data = JSON.stringify({

            "teacherid": propsData.teacherid,
            "code": propsData.code
        });

        var config = {
            method: 'post',
            url: '/teacherAction/submitAttendance',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log("axios callied from /takeAttendance TeacherAttendance component response => ", response);
                setTimeout(500);
                (response.data.failed)
                    ?
                    setStatus("Attendance is not Active")
                    :
                    setStatus("Attendance Submitted !")




            })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
    }

    return (

        <div>
            <div className="w-md  lg:w-12/12 px-4">
                <div className="">
                    <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={RefreshList}
                    >
                        Refresh Response List
                    </button>
                </div>
            </div>
            <div className="w-md rounded-lg shadow-2xl mt-6 mb-6 lg:w-12/12 px-4">
                <div class="dark-list">
                    <h3>Responded Students</h3>
                    <ul>
                        {responseUser.map((user, index) => {

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

            <div className="w-md  lg:w-12/12 px-4">
                <div className="">
                    <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={submitAttendance}
                    >
                        Submit Attendance
                    </button>
                </div>
            </div>
            <div className="w-md  lg:w-12/12 px-4">
                <div className="">
                    {Status}
                </div>
            </div>

        </div>
    );

}
export default TeacherMarkAttendance;