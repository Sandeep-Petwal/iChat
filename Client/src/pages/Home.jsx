import { useEffect, useState, useContext } from "react"
import { ChatContext } from "../context/ChatContext"

import Banner from "../components/Banner"
import Chat from "./Chat.jsx"

function Home() {
    const { user, login, logout, verifyUser } = useContext(ChatContext);
    const { isLoggedIn } = user

    return (
        <div>

            {/* show banner if not logged in if yes show chat  */}
            {
                isLoggedIn ? <Chat /> : <Banner />
            }
        </div>
    )
}

export default Home
