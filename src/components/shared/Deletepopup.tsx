import React, { useEffect, useRef } from 'react';

interface DeletePopupProps {
    isOpen: boolean;
    itemTitle: string | '';
    onConfirm: () => void;
    onCancel: () => void;
}

const Deletepopup: React.FC<DeletePopupProps> = ({ isOpen, itemTitle, onConfirm, onCancel }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);

    // Close popup if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" />
            {/* Popup */}
            <div ref={popupRef} className="bg-white p-4 rounded-md shadow-md w-[300px] z-50">
                <p className="text-[14px] font-[500] text-center">
                    Are you sure you want to delete{' '}
                    <span className="font-bold text-[16px]">{itemTitle}</span>?
                </p>
                <div className="flex justify-center mt-4 gap-x-2">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Deletepopup;


//const deleteRef = useRef<HTMLDivElement | null>(null);

// const openDeletePopup = (id: string) => setDeletePopup(id);
// const closeDeletePopup = () => setDeletePopup(null);

// const confirmDelete = (id: string) => {
//     handleDeleteCard(id); // Call the delete handler
//     setDeletePopup(null); // Close the popup
// };


// {deletePopup === item.id && (
//     // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//     //     <div className="bg-white p-4 rounded-md shadow-md w-[300px]">
//     <div
//         className="fixed inset-0 flex items-center justify-center">
//         {/* Overlay */}
//         <div
//             className="absolute inset-0 bg-black opacity-50" />
//         <div
//             ref={deleteRef}
//             className="bg-white p-4 rounded-md shadow-md w-[300px] z-50">
//             <p className="text-[14px] font-[500] text-center">
//                 Are you sure want to delete <span className="font-bold text-[16px]">{item.title}</span> ?
//             </p>
//             <div className="flex justify-center  mt-4 gap-x-2">
//                 <button
//                     onClick={() => confirmDelete(item.id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
//                     Delete
//                 </button>
//                 <button
//                     onClick={closeDeletePopup}
//                     className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     </div>
//     // </div>
// )}

