import React from "react";
import {
  FaUserFriends,
  FaClipboardList,
  FaBriefcase,
  FaBuilding,
  FaHandshake,
  FaAward,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Active Users",
    value: "24M+",
    icon: <FaUserFriends className="benefit-icon" />,
    color: "#4361ee",
  },
  {
    title: "Assessments",
    value: "22.3M+",
    icon: <FaClipboardList className="benefit-icon" />,
    color: "#4cc9f0",
  },
  {
    title: "Opportunities",
    value: "130K+",
    icon: <FaBriefcase className="benefit-icon" />,
    color: "#f72585",
  },
  {
    title: "Brands trust us",
    value: "800+",
    icon: <FaAward className="benefit-icon" />,
    color: "#7209b7",
  },
  {
    title: "Organisations",
    value: "42K+",
    icon: <FaBuilding className="benefit-icon" />,
    color: "#3a0ca3",
  },
  {
    title: "Partners",
    value: "78+",
    icon: <FaHandshake className="benefit-icon" />,
    color: "#4895ef",
  },
];

const BenefitsBar = () => {
  return (
    <div className="benefits-bar">
      <div className="benefits-container">
        {stats.map((item, index) => (
          <div
            key={index}
            className="benefit-card"
            style={{ "--benefit-color": item.color }}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <h2 className="benefit-value">{item.value}</h2>
            <p className="benefit-title">{item.title}</p>
            <div className="hover-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsBar;
