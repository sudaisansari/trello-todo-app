"use client"
import { useEffect, useRef, useState } from 'react'
import { addNewInput, loggedOutUser, setCardsData } from '@/store/slice'
import { useDispatch } from "react-redux"
import { useUserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'
import { RootState } from '../types/types'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Logo from "@/assets/trelloo.png"
import 'react-tooltip/dist/react-tooltip.css'
import UserButton from './UserButton';
import Button from './Button';

const Header = () => {
    const dispatch = useDispatch()
    const [input, setInput] = useState<string>(''); // Input field
    const { logOut } = useUserAuth();
    const router = useRouter()
    const { user } = useUserAuth(); // To get the logged-in user
    const [showInputError, setShowInputError] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("");
    const popupRef = useRef<HTMLInputElement>(null); // Add a ref for the input field     
    const email = user?.email
    const emailName = email?.split("@")[0].split(".")[0];
    const initialCharacter = emailName ? emailName.charAt(0).toUpperCase() : "";
    const [isUserOpen, setIsUserOpen] = useState(false);
    const data = useSelector((state: RootState) => state.cardsArray || []);

    const titles = data.map((item) => (item.id))

    const transformedData = data.map((item) => ({
        id: item.id,
        title: item.title
    }));
    console.log("Cat : ", category)

    if (category === undefined || titles.length === 1) {
        setTimeout(() => {
            setCategory(titles[0]);
            console.log("Category updated:", titles[0]);
        }, 300)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isUserOpen && popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserOpen]);

    const togglePopup = () => {
        setIsUserOpen((prev) => !prev);
    };

    const handleSignOut = () => {
        console.log("Called")
        try {
            console.log("Logging Out")
            logOut();
            dispatch(setCardsData([]))
            dispatch(loggedOutUser());
            console.log("Redux Data after logout : ", data)
            router.push("/SignIn")
        } catch (error) {
            console.log(error);
        }
    };

    const handleAdd = () => {
        if (input.trim() === '') {
            setShowInputError(true); // Show error for empty input
            return;
        }
        setShowInputError(false); // Clear error

        if (!category) {
            console.error("No category selected");
            return;
        }
        console.log("ID:", category, "Input:", input);
        dispatch(addNewInput({ id: category, value: input }));
        setInput('');
    };

    return (
        <div className='py-[8px] gap-y-[8px] px-[30px] bg-[#8D6ABF] z-40 top-0 sticky'>
            <div className='flex items-center justify-between md:justify-evenly'>
                {/* Logo */}
                <div className='flex gap-x-[4px] items-center justify-center cursor-pointer'>
                    <Image src={Logo} alt='Trello' width={25} height={25} />
                    <h1 className='font-[700] text-[20px] md:text-[30px] text-[#F4F4F4] md:leading-[1.66666666667vw]'>Trello</h1>
                </div>

                <div className='md:block hidden'>
                    <div className="flex justify-between">
                        {/* Input Section */}
                        <div className="flex justify-center my-1 md:my-0">
                            {/* Input Field */}
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)} //bg-[#22272B] text-[#F4F4F4]
                                className={`py-[8px] px-[12px] rounded-xl bg-[#E5E7EB] text-black  cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
                                placeholder="Enter task.."
                            />

                            {/* Dropdown Menu */}
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                                className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px] rounded-xl mx-1 font-[500]"
                            >
                                {
                                    transformedData.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                            className='bg-white text-[16px] text-black  text-start'>
                                            {item.title.length > 7 ? `${item.title.slice(0, 6)}..` : item.title}
                                        </option>
                                    ))
                                }
                            </select>

                            {/* Add Button */}
                            <Button name='Add Task' action={handleAdd} bgColor='bg-[#E5E7EB]' />
                        </div>
                    </div>
                </div>
                <div
                    ref={popupRef}
                    className="relative">
                    {/* Main Button */}
                    <UserButton togglePopup={togglePopup} initialCharacter={initialCharacter} />
                    {/* Popup */}
                    {isUserOpen && (
                        <div
                            className="absolute top-full mt-1 right-0 w-auto bg-[#F4F4F4] text-black rounded-lg shadow-lg  py-1 z-20 transition-all duration-500 ease-in-out transform opacity-100">
                            <p className="text-md px-3 py-1 hover:bg-[#6E776B] font-semibold">{email || "No email available"}</p>
                            <button
                                onClick={handleSignOut}
                                className="text-md px-3 py-1 hover:bg-[#6E776B] text-red-700 hover:text-black w-full text-start font-semibold hover:translate-y-[1px] transition-transform"
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className='md:hidden block mt-[8px]'>
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Input Section */}
                    <div className="flex justify-center my-1">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)} //bg-[#22272B] text-[#F4F4F4]
                            className={`py-[4px] px-[8px] w-[100px] rounded-xl bg-[#E5E7EB] text-black  cursor-text hover:ring-1 ring-black ${showInputError ? '' : ''}`}
                            placeholder="Enter task.."
                        />

                        {/* Dropdown Menu */}
                        <select
                            value={category}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                setCategory(selectedId);
                            }} className="bg-[#E5E7EB] text-black hover:cursor-pointer min-w-[72px]  rounded-xl mx-1 font-[500]"
                        >
                            {
                                transformedData.map((item) => (
                                    <option key={item.id} value={item.id}
                                        className='bg-white text-[14px] text-black  text-start'>
                                        {item.title.length > 7 ? `${item.title.slice(0, 6)}..` : item.title}
                                    </option>
                                ))
                            }
                        </select>
                        {/* Add Button */}
                        <div className='cursor-pointer px-2 py-1  bg-[#E5E7EB] hover:translate-y-[1px] transition-transform rounded-xl w-max' >
                            <button
                                onClick={handleAdd}
                                className='text-[14px] text-black font-[500]'>
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header