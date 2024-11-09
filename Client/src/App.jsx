import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col bg-slate-800 min-h-screen">
      <div
        className="flex-grow"
      >
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
