import { createContext } from "react";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;


const  ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, user_id: null, email: null , temp  : "wokkig"});

    const login = (user_id, email, name) => {
        setUser({isLoggedIn: true,user_id,email,name,});
    };

    const logout = () => {
        console.log("Logging out :: removing token from localstorage");
        localStorage.removeItem("ichat_token");
        setUser({isLoggedIn: false,user_id: null,email: null,name: null,});
    };

    // Function to verify user with token from localStorage
    const verifyUser = async (ichat_token) => {
        console.log("context :: verifyUser");
        try {
            const response = await fetch(`${apiUrl}/auth/verify`, { headers: { ichat_token } });
            if (!response.ok) { 
                localStorage.removeItem("ichat_token");
                return console.log(" coudn't verify the token, deleting from local storage")
            }

            console.log("Token verified");
            const data = await response.json();
            const { user_id, email, name } = data.data;
            setUser({ isLoggedIn: true, user_id, email, name, });
        } catch (error) {
            console.error("Error verifying user:", error);
            logout();
        }
    };



    return (
        <ChatContext.Provider value={{ user, login, logout, verifyUser }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext };
