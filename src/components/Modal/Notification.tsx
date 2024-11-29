import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import Button from '../Button'

interface Props {
    itemWatching?: boolean
    watchingClick: () => void
}

const Notification: React.FC<Props> = ({ itemWatching, watchingClick }) => {
    return (
        <div className="ml-[28px] mt-[26px] ">
            <h2 className="font-[500] text-[12px] mb-[8px]">Notifications</h2>          
            <Button bgColor='bg-[#6E776B]' name='Watching' itemWatching={itemWatching} action={watchingClick} icon={<MdOutlineRemoveRedEye />} checkIcon={<FaCheck />} />
        </div>
    )
}

export default Notification