const { storeMessage } = require("../controller/messageController");
const { setOnline, setOffline } = require("../controller/userController")
const onlineUsers = new Map();

const socketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log("New Connection connected!\n");
        io.emit("connection", "A new user connected!");


        socket.on("start_typing", ({ from, to }) => {
            console.log(from + " is started typing for " + to);
            io.emit(`startedTyping${to}`, ({ from, to })); 
        })

        socket.on("stop_typing", ({ from, to }) => {
            console.log(from + " is stoped typing for " + to);
            io.emit(`stopedTyping${to}`, ({ from, to }));
        });

        // store user online 
        socket.on("online", (user_id) => {
            onlineUsers.set(user_id, socket.id);
            console.log("User " + user_id + " is online.");

            io.emit("userOnline", user_id);  // send online event to frontend
            setOnline(user_id);             // store online status to db
        })

        // listen messages
        socket.on("message", ({ sender_id, receiver_id, content }) => {
            console.table({ sender_id, receiver_id, content });
            console.log("Message received from: " + sender_id + ", to: " + receiver_id);

            // send to receiver only
            io.emit(receiver_id, { sender_id, receiver_id, content });
            storeMessage(sender_id, receiver_id, content);
        });

        //  disconnection
        socket.on('disconnect', (user_id) => {
            console.table(user_id)
            console.log("User disconnected!");
            // find the user that disconnected by their socket ID
            for (let [user_id, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(user_id);
                    console.log(`User ${user_id} disconnected.`);

                    io.emit("userOffline", user_id); // send offline event to frontend
                    setOffline(user_id);            // store offline status to db
                    break;
                }
            }
        });

        // error handling
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
};

module.exports = { socketConnection };
