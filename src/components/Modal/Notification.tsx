import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdOutlineRemoveRedEye } from 'react-icons/md'

interface Props {
    itemWatching?: boolean
    watchingClick: () => void
}

const Notification: React.FC<Props> = ({itemWatching, watchingClick}) => {
    return (
        <div className="ml-[28px] mt-[26px]">
            <h2 className="font-[500] text-[12px]">Notifications</h2>
            <div
                onClick={watchingClick}
                className='cursor-pointer mt-[8px] w-max flex flex-row px-3 py-2 bg-[#6E776B] text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center ' >
                {/* Add Card Button */}
                < div
                    className='flex flex-row items-center gap-x-[8px] text-black '
                //onClick={submitInput} // Show new input field when clicked
                >
                    <MdOutlineRemoveRedEye className='text-[18px]' />
                    <span className='text-[16px] font-[500]'>Watching</span>
                    {itemWatching &&
                        <FaCheck />
                    }
                </div>
            </div>
        </div>
    )
}

export default Notification