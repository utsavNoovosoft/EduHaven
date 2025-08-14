import React from "react";

const SudokuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.size || 32}
    height={props.size || 32}
    fill="currentColor"
    {...props}
  >
    <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12-12-5.373-12-12 5.373-12 12-12zm0 22c5.528 0 10-4.472 10-10s-4.472-10-10-10-10 4.472-10 10 4.472 10 10 10zm-1-15h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm-4-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm8 0h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2z" />
  </svg>
);

export default SudokuIcon;
