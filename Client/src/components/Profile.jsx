/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react';
import { ChatContext } from "../context/ChatContext"
import Modal from 'react-modal';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5) for more visibility
    }, content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'white', // Text color inside the modal
        backgroundColor: '#1f2937', // Background color of the modal
        minWidth: '340px', // Set the width you want
        // height: '400px', // Set the height you want

    },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function Profile() {

    const { user, login, logout, verifyUser } = useContext(ChatContext);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false)



    const handleEditProfile = async (e) => {
        e.preventDefault();
        console.log("Editing user profile, id:  " + user.user_id + ", email: " + email + ", name : " + name);
        try {
            // http://localhost:3000/api/auth/update/300
            const response = await axios.put(`${apiUrl}/auth/update/${user.user_id}`,
                { name, email }
            );
            toast.success("Successfully updated the profile !");
            user.name = name;
            user.email = email
            setEditModalIsOpen(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }

    }


    return (
        <div>
            {/* edit modal  */}
            <div>
                <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={() => {
                        setEditModalIsOpen(false);
                    }}
                    style={customStyles}
                    contentLabel="Example Modal"
                    className={""}
                >
                    <div className="content md:w-[700px]  m-1 flex justify-center items-center flex-col">
                        <form
                            onSubmit={handleEditProfile}
                            className="mt-4 w-full md:w-[600px] max-w-lg">
                            {/* upload image  */}
                            <div>
                                {/*
                             <div className="flex items-center flex-col space-x-6 mb-4 ">
                                <div className="shrink-0">
                                    <img
                                        id="preview_img"
                                        className="h-28 mb-4 w-28 object-cover rounded-full border"
                                        // src={user.profile_picture ? `${baseUrl}/${user.profile_picture}` : `./avatar.png`}
                                        src={previewUrl}
                                        alt="Current profile photo"
                                    />
                                </div>
                                <label className="block">
                                    <span className="sr-only">Choose profile photo</span>
                                    <input
                                        accept="image/*" onChange={handleFileChange}
                                        type="file"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                    />

                                    {file &&
                                        <div className='mt-2 text-center'>
                                            <p>{(fileDetails.size / 1024 / 1024).toFixed(2)} Mb
                                                <span> ({fileDetails.type})</span></p>
                                        </div>
                                    }
                                    <p className='text-center text-yellow-400 mt-3 font-bold flex justify-center items-center flex-col' >
                                        {fileErrorMsg.trim() !== "" && <LuFileWarning size={50} />}
                                        {fileErrorMsg}</p>
                                </label>
                            </div> 
                            */}
                            </div>

                            <div className="flex items-center flex-col space-x-6 mb-4 ">
                                {/* {name.charAt(0)} */}

                                <div className="relative w-20 h-20">
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                                    <div className="text-5xl font-bold font-serif bg-orange-500 text-white rounded-full flex items-center justify-center w-full h-full">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-Name">Name</label>
                                <input
                                    maxLength={20}
                                    type="text"
                                    id="edit-Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-email">Email</label>
                                <input
                                    maxLength={30}
                                    type="email"
                                    id="edit-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                />
                            </div>

                            <div className="buttons flex justify-center mt-8 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setEditModalIsOpen(false)}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    // onClick={handleEditProfile}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                                    {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                    {!loading && (
                                        <span className='flex items-center justify-center'>
                                            Edit
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>

            <ul>
                <li
                    onClick={() => setEditModalIsOpen(true)}
                    key={user.user_id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded`}
                >
                    <div className="relative w-10 h-10">
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        <div className="bg-orange-500 text-white rounded-full flex items-center justify-center w-full h-full">
                            {user.name[0].toUpperCase()}
                        </div>
                    </div>

                    
                    <span className="ml-3">{user.name} (You)</span>
                </li>
            </ul>
        </div>
    )
}

export default Profile
