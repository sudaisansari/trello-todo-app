
interface Props {
    action: () => void;
    icon?: React.ReactNode;
    itemWatching?: boolean;
    checkIcon?: React.ReactNode;
    name: string;
    bgColor: string;
}

const Button: React.FC<Props> = ({ action, icon, itemWatching, checkIcon, name, bgColor }) => {
    return (
        <button
            onClick={action}
            className={`${bgColor} cursor-pointer w-max flex flex-row px-3 py-2  text-black hover:translate-y-[1px] transition-transform rounded-xl items-center justify-center`} >
            <div className={`flex flex-row items-center text-black ${icon ? "gap-x-[8px]" : ""}`}>
                <span className='text-[16px]'>{icon}</span>
                <span className='text-[16px] font-[500]'>{name}</span>
                {itemWatching &&
                    <span>{checkIcon}</span>
                }
            </div>
        </button>
    )
}

export default Button