import React from 'react'
import { ImParagraphLeft } from 'react-icons/im'
import RichTextDesc from '../RichTextDesc'
import Button from '../Button';

interface Props {
    isDesRichText: boolean;
    description: string | undefined;
    itemId: string | undefined;
    closeRichTextDesc: () => void;
    DesRichText: () => void;
}

const Description: React.FC<Props> = ({isDesRichText, description, itemId ,closeRichTextDesc, DesRichText }) => {
    return (
        <div className="mt-[26px]">
            <div className="flex justify-between w-auto md:w-[512px]">
                <div className="flex items-center gap-x-3">
                    <ImParagraphLeft className="text-[16px]" />
                    <h2 className="text-[16px] font-[700]">Description</h2>
                </div>
                {!isDesRichText ? (
                    // <button
                    //     onClick={DesRichText}
                    //     //className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                    //     className='cursor-pointer text-[16px] font-[500] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                    //     Edit
                    // </button>
                    <Button name='Edit' bgColor='bg-[#6E776B]' action={DesRichText} />
                ) : (
                    <div></div>
                )}
            </div>
            {!isDesRichText ? (
                <div
                    onClick={DesRichText}
                    className="h-[60px] ml-[28px] w-auto md:w-[512px] mt-[12px] rounded-md text-[16px] p-2 cursor-pointer hover:bg-[#747972] bg-[#6E776B]"
                    dangerouslySetInnerHTML={{
                        __html: description || "Add a more detailed description..."
                    }}
                ></div>
            ) : (
                <RichTextDesc Id={itemId} handleClose={closeRichTextDesc} initialContent={description} />
            )}
        </div>
    )
}

export default Description