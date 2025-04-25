import React from 'react'

const ChartSelect = () => {
  return (
    <div>ChartSelect</div>
  )
}

export default ChartSelect


// import { useState } from "react";

// const ChartSelect = ({selectedOption,setSelectedOption,options}) => {

//   return (
//     <div className="dropdown js-dropdown js-category-active">
//       <div
//         className="dropdown__button d-flex items-center bg-white border-light rounded-100 px-15 py-10 text-14 lh-12"
//         data-bs-toggle="dropdown"
//         data-bs-auto-close="true"
//         aria-expanded="false"
//         data-bs-offset="0,10"
//       >
//         <span className="js-dropdown-title">{selectedOption.title}</span>
//         <i className="icon icon-chevron-sm-down text-7 ml-10" />
//       </div>
//       <div className="toggle-element -dropdown  dropdown-menu">
//         <div className="text-14 y-gap-15 js-dropdown-list">
//           {options.map((option, index) => (
//             <div key={index}>
//               <button
//                 className={`d-block js-dropdown-link ${
//                   selectedOption.name === option.name ? "text-blue-1 " : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedOption(option);
//                   document.querySelector(".js-dropdown-title").textContent =
//                     option.title;
//                   // TODO: Apply filter based on selected option
//                 }}
//               >
//                 {option.title}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartSelect;
