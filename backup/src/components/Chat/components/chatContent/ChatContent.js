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

const ChatContent = (props) => {


  const { user_context } = useContext(userContext);
  const [USER_CONTEXT] = user_context;

  const { conversation_context } = useContext(conversationContext);
  const [CONVERSATION_CONTEXT] = conversation_context;

  const chatItms = [
    {
      key: 1,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: USER_CONTEXT._id,
      messageText: "Hi Tim, How are you?",
    },
    {
      key: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: USER_CONTEXT._id,
      messageText: "I am fine.",
    },
    {
      key: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: USER_CONTEXT._id,
      messageText: "What about you?",
    },
    {
      key: 4,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: USER_CONTEXT._id,
      messageText: "Awesome these days.",
    },
    {
      key: 5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: USER_CONTEXT._id,
      messageText: "Finally. What's the plan?",
    },
    {
      key: 6,
      image:
        "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      type: "",
      messageText: "what plan mate?",
    },
    {
      key: 7,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      messageText: "I'm taliking about the tutorial",
    },
  ];
  const [chat, setChat] = useState([])
  const msgRef = useRef("")
  const [msg, setMsg] = useState("")
  const [mySocketID, setMySocketID] = useState()
  const [showModal, setShowModal] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const user_id = USER_CONTEXT._id;
  const username = USER_CONTEXT._name;
  //calling event listner for message text field

  console.log("CONVERSATION_CONTEXT ", CONVERSATION_CONTEXT);

  const messageTextSend = () => {
    if (msgRef.current != "") {
      let message = {
        conversationId: CONVERSATION_CONTEXT.conversationId,
        fromParticipentId: USER_CONTEXT._id,
        toParticipentId: CONVERSATION_CONTEXT.id,
        isDeletedFor: [],
        isSeen: false,
        isMediaMessage: false,
        mediaLink: "",
        mediaTag: [],
        mediaScopeLevel: "",
        messageText: msgRef.current,
        messageDate: "",
        type: user_id,
        image:
          "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
      };
      // chatItms.push(message);
      socketRef.current.emit("send message -to server", message);
      setChat([...chat, message]);
      // setState({ chat: [...chatItms, message] });
      scrollToBottom();

    }
  }


  // console.log("event listner attached !!");
  // window.addEventListener("keydown", (e) => {
  //   if (e.keyCode == 13) {
  //     messageTextSend()
  //   }
  // });



  const onStateChange = (e) => {
    msgRef.current = e.target.value
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
    socketRef.current = io.connect("http://localhost:4000");

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
    // chatItms.push(message);
    setChat((prev) => [...prev, message]);
    //chatItms.push(message);
    scrollToBottom();
    console.log(chat);
  }




  //===== useEffects ====START=========



  useEffect(() => {
    console.log("chatContent => useEffect CONVERSATION_CONTEXT.conversationId ");

    socketMethods();

    getMessages();

    console.log("chatContent => getMessages called");
  }, [CONVERSATION_CONTEXT.conversationId])




  //===== useEffects ====END=========






  return (

    <div className="main__chatcontent">

      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar
              isOnline="active"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
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
        <div className="chat__items">
          {CONVERSATION_CONTEXT.conversationId ?
            // console.log("chatmap called chat=>", chat) &&
            chat.map((itm, index) => {
              return (

                <ChatItem
                  animationDelay={index + 2}
                  key={index}
                  user={itm.fromParticipentId != USER_CONTEXT._id ? "other" : "me"}
                  msg={itm.messageText}
                  image={itm.fromParticipentId != USER_CONTEXT._id ? "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU" : "https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg"}
                />
              );
            }) : <p>Select Chat to start with .. </p>}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Pop up Media Message Modal */}

      <div id="popup1" class="overlay">
        <div class="popup">
          <div className="w-md rounded-lg shadow-2xl mt-6 mb-6 lg:w-12/12 px-4">
            <a class="close" href="#">&times;</a>

          </div>
        </div>
      </div>




      <div className="content__footer">
        <div className="sendNewMessage">
          <a className="addFiles" href="#popup1">
            <i className="fa fa-plus"></i>
          </a>
          <input
            type="text"
            placeholder="Type a message here"
            onChange={onStateChange}

          />
          <button className="btnSendMsg" id="sendMsgBtn" onClick={messageTextSend}>
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );

}
export default ChatContent;
