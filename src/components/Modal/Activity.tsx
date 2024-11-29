import React from "react";
import { RxActivityLog } from "react-icons/rx";
import RichText from "@/components/RichtextActivity"; 
import { Item } from "@/types/types";
import UserButton from "../UserButton";

interface ActivitySectionProps {
    itemData: Item | undefined; 
    initialCharacter: string;
    emailName: string | undefined;
    isRichTextComp: boolean;
    enableRichTextActivity: () => void;
    closeRichTextComp: () => void;
    isEditActivity: string | null;
    handleEditActivity: (id: string, content: string) => void;
    openDeletePopup: (id: string) => void;
    deletePopup: string | null;
    confirmDelete: (id: string) => void;
    closeDeletePopup: () => void;
    editActivity: () => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
    itemData,
    initialCharacter,
    emailName,
    isRichTextComp,
    enableRichTextActivity,
    closeRichTextComp,
    isEditActivity,
    handleEditActivity,
    openDeletePopup,
    deletePopup,
    confirmDelete,
    closeDeletePopup,
    editActivity,
}) => {
    return (
        <div className="mt-[26px]">
            <div className="flex items-center gap-x-3 ">
                <div>
                    <RxActivityLog className="text-[16px] text-black" />
                </div>
                <h2 className="text-[16px] font-[700]">Activity</h2>
            </div>
            <div className="mt-[12px]">
                <div className="flex items-start gap-x-2">
                    <div className="bg-[#FF991F] flex items-center justify-center rounded-full p-4 w-5 h-5">
                        <span className="text-black ">
                            {initialCharacter ? initialCharacter : "A"}
                        </span>
                    </div>
                    {!isRichTextComp ? (
                        <div
                            onClick={enableRichTextActivity}
                            className="h-[36px] w-full md:w-[502px] rounded-md text-[16px] pl-2 pt-1 font-[500] cursor-pointer hover:bg-[#747972] bg-[#6E776B]"
                        >
                            Write a comment...
                        </div>
                    ) : (
                        <div>
                            <div>
                                <RichText handleClose={closeRichTextComp} Id={itemData?.id} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-[12px]">
                    {itemData?.activity?.map((item) => (
                        <div key={item.id}>
                            <div className="flex items-start gap-x-2">                                
                                <UserButton initialCharacter={initialCharacter} />
                                <div>
                                    <div className="text-[14px] font-[500]">
                                        <span className="text-[16px] font-[500]">{emailName}</span>{" "}
                                        {item.dateTime}
                                    </div>
                                    {isEditActivity === item.id ? (
                                        <RichText
                                            handleClose={editActivity}
                                            Id={item.id}
                                            initialContent={item.content}
                                            handleEditActivity={handleEditActivity}
                                        />
                                    ) : (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item.content,
                                            }}
                                            className="min-h-[36px] w-full md:w-[502px] rounded-md text-[16px] pl-2 pt-1 hover:bg-[#747972] bg-[#6E776B]"
                                        ></div>
                                    )}
                                </div>
                            </div>
                            {isEditActivity === item.id ? (
                                <div></div>
                            ) : (
                                <div className="flex ml-[48px] gap-x-2">
                                    <button
                                        onClick={() => handleEditActivity(item.id, item.content)}
                                        className="text-[12px] font-[500] hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeletePopup(item.id)}
                                        className="text-[12px] font-[500] hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                            {/* Delete Confirmation Popup */}
                            {deletePopup === item.id && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-4 rounded-md shadow-md w-[300px]">
                                        <p className="text-[14px] font-[500] text-center">
                                            Are you sure you want to delete this activity?
                                        </p>
                                        <div className="flex justify-center mt-4 gap-x-2">
                                            <button
                                                onClick={() => confirmDelete(item.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={closeDeletePopup}
                                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivitySection;
