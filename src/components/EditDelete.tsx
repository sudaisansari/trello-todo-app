import React from "react";

interface Props {
  icon: React.ReactNode;
  onClick: () => void; 
  className?: string;
}

const EditDelete: React.FC<Props> = ({ icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hover:translate-y-[1px] transition-transform cursor-pointer"
    >
      {icon}
    </button>
  );
};

export default EditDelete;
