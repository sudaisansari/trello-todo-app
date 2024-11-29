import React from 'react'

interface Props {
    togglePopup?: () => void,
    initialCharacter: string
}

const UserButton: React.FC<Props> = ({togglePopup, initialCharacter}) => {
    return (
        <button
            onClick={togglePopup}
            className="bg-[#FF991F] hover:cursor-pointer hover:ring-2 ring-white flex items-center justify-center rounded-full p-4 w-5 h-5">
            <span className="text-black font-[500]">
                {initialCharacter ? initialCharacter : ""}
            </span>
        </button>)
}

export default UserButton