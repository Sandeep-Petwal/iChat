// Banner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <section className="relative mb-5 p-10 bg-blueGray-800"> {/* Darker background */}
            <div className="items-center flex flex-wrap">
                <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                    <img
                        alt="Chat App"
                        className="max-w-full rounded-lg shadow-lg"
                        src="banner.jpg"
                    />
                </div>
                <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                    <div className="md:pr-12">
                        <div className="flex gap-4 items-center">
                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-600 mt-8">
                                <i className="fas fa-comments text-2xl"></i>
                            </div>
                            <h2 className='text-white font-extrabold text-4xl font-serif'>iChat</h2>
                        </div>

                        <h3 className="text-3xl font-semibold text-white">Connect with Friends</h3>
                        <p className="mt-4 text-lg leading-relaxed text-white">
                            Chat easily with your friends and family. Our platform allows you to send messages, share files, and create group chats seamlessly.
                        </p>
                        <ul className="list-none mt-6 text-white">
                            {[
                                { icon: 'fas fa-user-friends', text: 'Stay connected with friends' },
                                { icon: 'fas fa-file-alt', text: 'Share files effortlessly' },
                                { icon: 'fas fa-user-plus', text: 'Add new contacts easily' },
                            ].map((item, index) => (
                                <li key={index} className="py-2">
                                    <div className="flex items-center">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 mr-3">
                                                <i className={item.icon}></i>
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white">{item.text}</h4>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex gap-10 p-5 justify-center">
                            <Link to="/login">
                                <button className="text-lg font-bold py-3 px-6 border-2 border-purple-600 rounded-md transition-all duration-300 bg-transparent  hover:bg-purple-600  text-white shadow-md transform hover:scale-105">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="text-lg font-bold py-3 px-6 border-2 border-green-600 rounded-md transition-all duration-300 bg-transparent  hover:bg-green-600 text-white shadow-md transform hover:scale-105">
                                    Signup
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
