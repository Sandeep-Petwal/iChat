import { createRoot } from 'react-dom/client'
import router from './router/router.jsx'
import { RouterProvider } from 'react-router-dom'
import "./index.css"
import { ChatContextProvider } from "./context/ChatContext.jsx"

createRoot(document.getElementById('root')).render(
  <>
    <ChatContextProvider>
      <RouterProvider router={router} />
    </ChatContextProvider>
  </>,
)
