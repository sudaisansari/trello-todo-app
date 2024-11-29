import React from 'react'

interface Props {
    initialCharacter: string;
    emailName?: string;
    dateTime?: string;
    cardTitle?: string
}

const CardAddedUser: React.FC<Props> = ({ initialCharacter, emailName, dateTime, cardTitle }) => {
    return (
        <div className="flex items-start gap-x-2">
            <div className="bg-[#FF991F] flex items-center justify-center rounded-full p-4 w-5 h-5">
                <span className="text-black ">
                    {initialCharacter ? initialCharacter : "A"}
                </span>
            </div>
            <div>
                <div className="text-[14px] font-[500]">
                    <span className="text-[16px] font-[500]">{emailName}</span> added this card to {cardTitle && cardTitle.length > 10 ? `${cardTitle.slice(0, 9)}..` : cardTitle || ""}
                </div>
                <div className="text-[14px] font-[500]">
                    {dateTime}
                </div>
            </div>
        </div>
    )
}

export default CardAddedUser