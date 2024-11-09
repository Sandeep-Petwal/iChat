/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useContext } from 'react';
import { ChatContext } from "../context/ChatContext";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import io from 'socket.io-client';

import UserList from '../components/UserList';
import UserProfile from '../components/UserProfile';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const socket = io('http://localhost:3000', { reconnection: true, reconnectionAttempts: 5 });

function Chat() {
    const navigate = useNavigate();
    const { user_params } = useParams();
    const { user } = useContext(ChatContext);
    const user_id = user.user_id;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const onStartTyping = () => {
        console.log("You started typing!");
        socket.emit("start_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };

    const onStopTyping = () => {
        console.log("You stopped typing!");
        socket.emit("stop_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };

    // useEffect(() => {

    // }, [])




    // Load messages
    const loadConversation = useCallback(async (selectedUserId) => {
        try {
            const response = await axios.get(`${apiUrl}/messages/conversation?sender=${selectedUserId}&receiver=${user_id}`);
            setMessages(response.data.data || []);
            // console.table(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch messages');
        }
    }, [user_id]);

    // Refresh messages
    const reloadMessages = (userId) => {
        loadConversation(userId);
    };

    // Send message
    const handleSendMessage = () => {
        if (!message || !selectedUser) return;
        const newMessage = { content: message, sender_id: user_id, receiver_id: selectedUser.user_id };
        socket.emit('message', newMessage);
        setMessages(prev => [...prev, newMessage]);
        setTimeout(() => {
            reloadMessages(selectedUser.user_id);
        }, 2000);
        setMessage('');
    };

    // Handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        navigate(`/${user.user_id}`);
        loadConversation(user.user_id);

        // Set unread to false for the selected user
        // setUsers(prevUsers =>
        //     prevUsers.map(prevUser =>
        //         prevUser.user_id === user.user_id
        //             ? { ...prevUser, unread: false }
        //             : prevUser
        //     )
        // );
    };

    // url parameter handling
    useEffect(() => {
        if (user_params && !isNaN(user_params)) {
            console.log("Params available = " + user_params);
            const selectedUserId = Number(user_params);
            console.log("serching in users");
            const userToSelect = users.find(user => user.user_id === selectedUserId);
            if (userToSelect) {
                handleUserSelect(userToSelect);
            } else {
                console.log("User not found for ID:", selectedUserId);
            }
        } else {
            console.log("Params not available or not a number.");
        }
    }, [user_params]);


    // Listen for new messages
    useEffect(() => {
        // send the user online info
        socket.emit("online", user_id);

        socket.on("userOnline", (user_id) => {        // listen other users online status and update state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.user_id === user_id ? { ...user, online: true } : user
                )
            )
        })

        socket.on("userOffline", (user_id) => {        // listen other users offline status and update state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.user_id === user_id ? { ...user, online: false } : user
                )
            )
        })

        // recieve messages
        socket.on(user_id, msg => {
            if (msg.sender_id === selectedUser?.user_id) {
                setMessages(prev => [...prev, msg]);
            } else {
                // adding unread propery to true
                // setUsers(prevUsers =>
                //     prevUsers.map(user =>
                //         user.user_id === msg.sender_id
                //             ? { ...user, unread: true }
                //             : user
                //     )
                // );
            }
        });


        socket.on(`startedTyping${user_id}`, ({ from, to }) => {
            console.log(from + " is typing for you");
            setUsers(prevUsers =>
                prevUsers.map(prevUser =>
                    prevUser.user_id == from
                        ? { ...prevUser, typing: true }
                        : { ...prevUser, typing: false }
                )
            );
        })

        socket.on(`stopedTyping${user_id}`, ({ from, to }) => {
            console.log(from + " is stoped typing for you");
            setUsers(prevUsers =>
                prevUsers.map(prevUser =>
                    prevUser.user_id == from
                        ? { ...prevUser, typing: false }
                        : { ...prevUser, typing: false }
                )
            );
        })


        return () => socket.off(user_id);
    }, [selectedUser]);



    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/allusers`);
                // setUsers(response.data.data || []);
                setUsers(response.data.data.map(obj => ({ ...obj, unread: false })) || [])
                console.log("Users are :: ");
                console.table(response.data.data.map(obj => ({ ...obj, unread: false })));
            } catch {
                toast.error('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);


    return (
        <div className="flex flex-col md:flex-row bg-gray-900 text-white">
            <UserList users={users} user_id={user_id} onSelect={handleUserSelect} selectedUser={selectedUser} />
            <div style={{ height: 'calc(100vh - 70px)' }} className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <UserProfile user={selectedUser} onBack={() => {
                            navigate("/");
                            setSelectedUser(null)
                        }} />
                        <MessageList messages={messages} selectedUser={selectedUser} reloadMessages={reloadMessages} setMessages={setMessages} user_id={user_id} />
                        <MessageInput
                            onStartTyping={onStartTyping}
                            onStopTyping={onStopTyping}
                            message={message}
                            setMessage={setMessage}
                            onSendMessage={handleSendMessage}
                        />
                    </>
                ) : (
                    <div className='hidden md:flex justify-center items-center flex-col p-10'>
                        <h2 className='text-gray-300'>Select a chat to get started</h2>
                        <div className="flex gap-4 items-center">
                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-600 mt-8">
                                <i className="fas fa-comments text-2xl"></i>
                            </div>
                            <h2 className='text-white font-extrabold text-4xl font-serif'>iChat</h2>
                        </div>

                        <h3 className="text-3xl font-semibold text-white">Connect with Friends</h3>
                        <p className="mt-4 text-lg leading-relaxed text-white text-center">
                            Chat easily with your friends and family. Our platform allows you to send messages, share files, and create group chats seamlessly.
                        </p>
                    </div>
                )}
                <Toaster position="top-center" />
            </div>
        </div>
    );
}

export default Chat;
