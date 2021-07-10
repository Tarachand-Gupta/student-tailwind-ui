import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";



import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";
import io from "socket.io-client";
import axios from "axios";
import { conversationContext } from "../../../../Context/conversationContext";
import { userContext } from "../../../../Context/userContext"
import { useHistory } from 'react-router-dom'

const ChatContent = (props) => {

  const history = useHistory()

  const { user_context } = useContext(userContext);
  const [USER_CONTEXT] = user_context;

  const { conversation_context, conversation_panel_context } = useContext(conversationContext);
  const [CONVERSATION_CONTEXT] = conversation_context;
  const [CONVERSATION_PANEL_CONTEXT, setCONVERSATION_PANEL_CONTEXT] = conversation_panel_context;


  const [chat, setChat] = useState([])
  const [scope, setScope] = useState("")
  const [mediaLink, setMediaLink] = useState("")
  const [mediaType, setMediaType] = useState("text")
  const [mediaTags, setMediaTags] = useState([])
  const msgRef = useRef("")
  const inputFormRef = useRef()
  const [mySocketID, setMySocketID] = useState()
  const [openTab, setOpenTab] = useState(1);

  let messageTextBoxVRef = useRef();
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const user_id = USER_CONTEXT._id;
  const username = USER_CONTEXT._name;



  //========== For Dropdown =======
  const [isOpen, setOpen] = useState(false);
  // const data = [USER_CONTEXT.scope];//{ id: 0, label: "Istanbul, TR (AHL)" }, { id: 1, label: "Paris, FR (CDG)" }
  const [items, setItem] = useState(USER_CONTEXT.scope);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    console.log("selected ", selectedItem);
    setScope(selectedItem)
    toggleDropdown()
  }
  //========== For Dropdown



  console.log("CONVERSATION_CONTEXT ", CONVERSATION_CONTEXT);

  const messageTextSend = (e) => {
    if (msgRef.current != "" || mediaLink != "") {
      let message = {
        conversationId: CONVERSATION_CONTEXT.conversationId,
        fromParticipentId: USER_CONTEXT._id,
        toParticipentId: CONVERSATION_CONTEXT.id,
        isDeletedFor: [],
        isSeen: false,
        isMediaMessage: false,
        mediaLink: mediaLink,
        mediaTag: mediaTags,
        mediaScopeLevel: scope,
        messageText: msgRef.current,
        messageDate: "",
        type: mediaType,
        image:
          "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      };
      // chatItms.push(message);
      socketRef.current.emit("send message -to server", message);
      setChat([...chat, message]);
      setMediaLink("")
      setScope("")
      setMediaType("text")
      inputFormRef.current?.reset();

      // messageTextBoxVRef.current.value = ""
      // setMsg("");
      scrollToBottom();



    }
  }

  const handleKeyDown = (event) => {

    if (event.key === 'Enter') {
      event.preventDefault()
      messageTextSend()
    }
  }

  const getBack = (e) => {
    setCONVERSATION_PANEL_CONTEXT({
      chatlist: true,
      chatContent: false
    })
  }

  const getMessages = () => {
    // ================ Axios =========Start=========
    const data = JSON.stringify({
      "conversationId": CONVERSATION_CONTEXT.conversationId
    });

    console.log("CONVERSATION_CONTEXT.conversationId ", CONVERSATION_CONTEXT.conversationId);
    const config = {
      method: 'post',
      url: '/messageAction/getConversation',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };


    axios(config)
      .then(function (response) {
        console.log("axios callied from ChatContent component");
        // chatItms = [response.data];


        console.log("/getMessages response.data : => ", response.data);
        // console.log("chatContent => chatItems : => ", chatItems); 
        setChat(response.data);
        console.log("chatContent =>  chat : => ", chat);
        //==== changing Route =====
        //openRoute.push("/admin/dashboard");

      })
      .catch(function (error) {
        console.log(error);
        console.log("chatContent =>   state.chat : => ", chat);
      });
    // ================ Axios =========End=========
    //


  }

  const socketMethods = () => {
    socketRef.current = io.connect("https://student-react-api.herokuapp.com");

    socketRef.current.emit('user-update socketID in userDB', USER_CONTEXT._id);

    socketRef.current.on("user - get my socket id", (id) => {
      setMySocketID(id);
      console.log("Socket ID : ", mySocketID);
    });

    socketRef.current.on("recive message -from server", (message) => {

      // (message.fromParticipentId != USER_CONTEXT._id) ?
      reciveMessage(message)
      // :
      // console.log("message from ", USER_CONTEXT.firstname, " => ", message);
    });
  }

  const scrollToBottom = () => {

    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })



  };

  const reciveMessage = (message) => {
    setChat((prev) => [...prev, message]);
    scrollToBottom();
    console.log(chat);

  }
  //===== useEffects ====START=========

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  }, [chat])

  useEffect(() => {
    console.log("chatContent => useEffect CONVERSATION_CONTEXT.conversationId ");

    socketMethods();

    getMessages();


    console.log("chatContent => getMessages called");
  }, [CONVERSATION_CONTEXT.conversationId])

  //===== useEffects ====END=========


  return (

    <div className="">

      <div className="content__header">

        <div className="blocks">
          <div onClick={getBack} className="back" > {"< Back"} </div>
          <div className="current-chatting-user">
            <Avatar
              isOnline="active"
              image={USER_CONTEXT.userprofile}
            />
            <p>{USER_CONTEXT.firstname + " with " + CONVERSATION_CONTEXT.chatWithUser}</p>
          </div>
        </div>

        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <i className="fa fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="content__body">
        <div className="chat__items" >
          {CONVERSATION_CONTEXT.conversationId ?
            // console.log("chatmap called chat=>", chat) &&
            chat.map((itm, index) => {
              return (

                <div ref={messagesEndRef}>
                  <ChatItem
                    animationDelay={index + 2}
                    key={index}
                    user={itm.fromParticipentId != USER_CONTEXT._id ? "other" : "me"}
                    msg={itm.messageText}
                    image={itm.fromParticipentId != USER_CONTEXT._id ? "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU" : "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg"}
                    timeAgo={itm.createdAt}
                    scope={itm.mediaScopeLevel}
                    mediaLink={itm.mediaLink}
                  />
                </div>
              );
            }) : <p>Select Chat to start with .. </p>}

        </div>
      </div>


      {/* Pop up Media Message Modal */}

      <div id="popup1" className="overlay">
        <div className="popup">
          <div className="w-md rounded-lg shadow-2xl mt-6 mb-6 lg:w-12/12 py-6 px-4">
            <a className="close" href="#">&times;</a>
            <>
              <div className="flex flex-wrap ">
                <div className="w-full ">
                  <ul
                    className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                    role="tablist">
                    <li className="-mb-px mr-2 mt-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 1
                            ? "text-white bg-indigo-600"
                            : "text-indigo-600 bg-white")
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(1);
                        }}
                        data-toggle="tab"
                        href="#link1"
                        role="tablist"
                      >
                        <i className="fas fa-file-alt text-base mr-1"></i> Docs
                      </a>
                    </li>
                    <li className="-mb-px mr-2 mt-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 2
                            ? "text-white bg-indigo-600"
                            : "text-indigo-600 bg-white")
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(2);
                        }}
                        data-toggle="tab"
                        href="#link2"
                        role="tablist"
                      >
                        <i className="fas fa-image text-base mr-1"></i> Image
                      </a>
                    </li>
                    <li className="-mb-px mr-2 mt-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 3
                            ? "text-white bg-indigo-600"
                            : "text-indigo-600 bg-white")
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(3);
                        }}
                        data-toggle="tab"
                        href="#link3"
                        role="tablist"
                      >
                        <i className="fas fa-video text-base mr-1"></i>  Video
                      </a>
                    </li>
                    <li className="-mb-px mr-2 mt-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 4
                            ? "text-white bg-indigo-600"
                            : "text-indigo-600 bg-white")
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(4);
                        }}
                        data-toggle="tab"
                        href="#link4"
                        role="tablist"
                      >
                        <i className="fas fa-link text-base mr-1"></i>  Link
                      </a>
                    </li>
                    <li className="-mb-px mr-2 mt-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 5
                            ? "text-white bg-indigo-600"
                            : "text-indigo-600 bg-white")
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(5);
                        }}
                        data-toggle="tab"
                        href="#link5"
                        role="tablist"
                      >
                        <i className="fas fa-volume-up text-base mr-1"></i>  Audio
                      </a>
                    </li>
                  </ul>
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="px-4 py-5 flex-auto">
                      <div className="tab-content tab-space">
                        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                          <div className="w-full lg:w-12/12 px-4 ">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-scope"
                              >
                                Share in
                              </label>

                              <div className='dropdown'>
                                <div className='dropdown-header' onClick={toggleDropdown}>
                                  {selectedItem ? selectedItem : "This chat (Default)"}
                                  {console.log("State items ", items)}
                                  <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
                                </div>
                                <div className={`dropdown-body ${isOpen && 'open'}`}>
                                  {items.map(item => (

                                    <div className="dropdown-item" onClick={e => handleItemClick(e.target.id)} id={`${item.scopeName}${" (", item.level, ")"}  `}>
                                      {console.log("State items drop ", item.scopeName)}
                                      <span className={`dropdown-item-dot ${item.scopeName == selectedItem && 'selected'}`}>• </span>
                                      {item.scopeName + " (" + item.level + ")"}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* <input
                                value={scope}
                                onChange={(e) => { setScope(e.target.value) }}
                                name="scope"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Enter Scope"

                              /> */}
                            </div>

                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                File Document :
                              </label>
                              <input
                                value={mediaLink}
                                onChange={(e) => { setMediaLink(e.target.value); setMediaType("docs") }}
                                name="file"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Filename"

                              />
                            </div>
                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                Tags :
                              </label>
                              <input
                                value={mediaTags}
                                onChange={(e) => { setMediaTags([e.target.value]) }}
                                name="tags"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="tags"

                              />
                            </div>
                          </div>

                        </div>
                        <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-scope"
                              >
                                Scope
                              </label>
                              <input
                                value={scope}
                                onChange={(e) => { setScope(e.target.value) }}
                                name="scope"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Enter Scope"

                              />
                            </div>

                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                File Image :
                              </label>
                              <input
                                value={mediaLink}
                                onChange={(e) => { setMediaLink(e.target.value); setMediaType("docs") }}
                                name="file"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Filename"

                              />
                            </div>
                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                Tags :
                              </label>
                              <input
                                value={mediaTags}
                                onChange={(e) => { setMediaTags([e.target.value]) }}
                                name="tags"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="tags"

                              />
                            </div>
                          </div>
                        </div>
                        <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-scope"
                              >
                                Scope
                              </label>
                              <input
                                value={scope}
                                onChange={(e) => { setScope(e.target.value) }}
                                name="scope"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Enter Scope"

                              />
                            </div>

                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                File Video :
                              </label>
                              <input
                                value={mediaLink}
                                onChange={(e) => { setMediaLink(e.target.value); setMediaType("docs") }}
                                name="file"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Filename"

                              />
                            </div>
                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                Tags :
                              </label>
                              <input
                                value={mediaTags}
                                onChange={(e) => { setMediaTags([e.target.value]) }}
                                name="tags"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="tags"

                              />
                            </div>
                          </div>
                        </div>
                        <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-scope"
                              >
                                Scope
                              </label>
                              <input
                                value={scope}
                                onChange={(e) => { setScope(e.target.value) }}
                                name="scope"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Enter Scope"

                              />
                            </div>

                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                File Link :
                              </label>
                              <input
                                value={mediaLink}
                                onChange={(e) => { setMediaLink(e.target.value); setMediaType("docs") }}
                                name="file"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Filename"

                              />
                            </div>
                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                Tags :
                              </label>
                              <input
                                value={mediaTags}
                                onChange={(e) => { setMediaTags([e.target.value]) }}
                                name="tags"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="tags"

                              />
                            </div>
                          </div>
                        </div>
                        <div className={openTab === 5 ? "block" : "hidden"} id="link5">
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-scope"
                              >
                                Scope
                              </label>
                              <input
                                value={scope}
                                onChange={(e) => { setScope(e.target.value) }}
                                name="scope"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Enter Scope"

                              />
                            </div>

                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                File Audio :
                              </label>
                              <input
                                value={mediaLink}
                                onChange={(e) => { setMediaLink(e.target.value); setMediaType("docs") }}
                                name="file"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="Filename"

                              />
                            </div>
                          </div>
                          <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                              <label
                                className="block  uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="media-file"
                              >
                                Tags :
                              </label>
                              <input
                                value={mediaTags}
                                onChange={(e) => { setMediaTags([e.target.value]) }}
                                name="tags"
                                type="text"
                                className="border-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="tags"

                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="#" className={"setMedia"}> {"Set Media"}</a>
              </div>
            </>
          </div>
        </div>
      </div>




      <div className="content__footer">
        <div className="sendNewMessage">
          <a className="addFiles" href="#popup1">
            <i className={mediaLink == "" ? "fa fa-plus" : "fa fa-check"}></i>
          </a>
          <form ref={inputFormRef} onSubmit={(e) => e.preventDefault()}>
            <input
              className="customInout"
              type="text"
              placeholder="Type a message here"
              onKeyDown={handleKeyDown}
              onChange={(e) => msgRef.current = e.target.value}
            // ref={messageTextBoxVRef}
            // value={ }

            />
          </form>
          <button className={"btnSendMsg"} id="sendMsgBtn" onClick={(e) => messageTextSend(e)}>
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );

}
export default ChatContent;
