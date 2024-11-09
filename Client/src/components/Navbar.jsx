import { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from "../context/ChatContext"
import { Link, useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

function Navbar() {

  const { user, login, logout, verifyUser } = useContext(ChatContext);
  const loggedIn = user.isLoggedIn;

  const checkUserStatus = () => {
    if (localStorage.getItem("ichat_token") && !user.isLoggedIn) {
      console.log("Nav :: Token availble now verifying token");
      verifyUser(localStorage.getItem("ichat_token"));
    }
  }

  useEffect(() => {
    checkUserStatus();
  }, [])

  const handleLogout = () => {
    console.log("Handle logout :::");
    logout();
  }




  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    console.log("Inside toggle");
    console.log(isOpen);
    setIsOpen((prev) => !prev);
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);







  return (
    <nav className="bg-white  dark:bg-gray-900 border-b border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to={"/"}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap font-serif dark:text-white">
            iChat
          </span>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          ref={menuRef}
          className={`${isOpen ? 'block' : 'hidden'
            } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {!loggedIn &&
              <div className="flex gap-5">
                <li>
                  <Link
                    to={"/"}
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/login"}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/signup"}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Signup
                  </Link>
                </li>
              </div>
            }

            {
              loggedIn &&
              <li>
                <Link
                  onClick={handleLogout}
                  className="flex  justify-center items-center gap-2 fontbo py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <CiLogout size={25} />
                  Logout
                </Link>
              </li>

            }

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
