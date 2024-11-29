import { updateCardInput } from '@/store/slice';
import React, { useEffect, useRef } from 'react';
import { FaTable } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch } from 'react-redux';

interface TitleWithCloseProps {
    itemId: string | undefined;
    cardTitle: string | undefined;
    value: string | undefined;
    editingTitle: boolean;
    currentTitle: string | undefined;
    onClose: () => void;
    handleTitleClick: (value: string | undefined) => void;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDownTitle: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    setEditingTitle: (editing: boolean) => void; // Pass setEditingTitle function
    setCurrentTitle: (title: string) => void;
}

const TitleWithClose: React.FC<TitleWithCloseProps> = ({
    itemId,
    value,
    cardTitle,
    editingTitle,
    currentTitle,
    onClose,
    handleTitleClick,
    handleTitleChange,
    handleKeyDownTitle,
    setEditingTitle,
    setCurrentTitle
}) => {
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (editingTitle && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingTitle]);


    const dispatch = useDispatch()
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node) && editingTitle) {
                if (currentTitle?.trim() === '') {
                    console.log("No input")
                    setEditingTitle(false)
                }
                else {
                    dispatch(updateCardInput({ id: itemId, input: currentTitle }));
                    setEditingTitle(false); // Reset edit mode
                    setCurrentTitle('')
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [itemId, currentTitle, dispatch, editingTitle])

    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-x-3">
                <div>
                    <FaTable className="text-[16px]" />
                </div>
                <div>
                    <div>
                        {editingTitle ? (
                            <input
                                type="text"
                                ref={inputRef}
                                value={currentTitle}
                                onChange={handleTitleChange}
                                className=" pl-[2px] pr-[6px] text-[24px] tracking-wider font-[600] break-word w-[90%] rounded-xl bg-[#E5E7EB] text-black hover:ring-2 ring-white cursor-text"
                                onKeyDown={handleKeyDownTitle}
                            />
                        ) : (
                            <div
                                onClick={() => handleTitleClick(value)}
                                className="font-[600] text-[24px] tracking-wider break-word pl-[2px] max-w-[176px] max-h-[100px] overflow-hidden py-[2px] w-full rounded-xl bg-[#E5E7EB] text-black"
                            >
                                {value}
                            </div>
                        )}
                    </div>
                    <div className="text-[16px]">
                        in list{" "}
                        <span className="font-[700]">
                            {cardTitle && cardTitle.length > 10
                                ? `${cardTitle.slice(0, 9)}..`
                                : cardTitle || ""}
                        </span>
                    </div>
                </div>
            </div>
            {/* Close Button */}
            <div onClick={onClose} className="cursor-pointer">
                <RxCross1 className="text-[24px]" />
            </div>
        </div>
    );
};

export default TitleWithClose;
