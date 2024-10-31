// Sidebar.jsx
import React from "react";
import { useAccordion } from "../context/AccordionContext"; // Adjust the path as necessary
import { Link, NavLink, useLocation } from "react-router-dom";
import { ListItem, ListItemPrefix } from "@material-tailwind/react";
import { PowerIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import { RiDashboardFill } from "react-icons/ri";
import {
  MdCardTravel,
  MdOutlineLibraryAdd,
  MdOutlinePeople,
} from "react-icons/md";
import {useNavigate} from "react-router-dom"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const { openAccordion, setOpenAccordion } = useAccordion();
  const location = useLocation();
const navigate = useNavigate()
  const toggleAccordion = (section) => {
    setOpenAccordion((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white text-black shadow-lg">
      <div className="p-4">
        <img
        className="w-[80%] m-auto"
          src="https://breakbag.com/static/media/logo.3fff3126fefbf4f3afe7.png"
          alt=""
        />
      </div>
      <nav>
        <div className="border-t border-gray-600"></div>

        {localStorage.getItem("userRole") == "Agent" ||
        localStorage.getItem("userRole") == "Team Lead" ? null : (
          <div>
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleAccordion("dashboard")}
            >
              <span className="flex justify-start gap-3 items-center">
                <RiDashboardFill  className="w-5 h-5"/>
                Dashboard
              </span>
              <span className="text-sm" >{openAccordion.includes("dashboard") ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </div>
            {openAccordion.includes("dashboard") && (
              <div className="pl-4">
                <Link
                  to="/agent"
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/agent") ? "text-main" : ""
                  }`}
                >
                  Agents & Team leads
                </Link>
                <Link
                  to="/destination"
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/destination") ? "text-main" : ""
                  }`}
                >
                  Destination
                </Link>
                <Link
                  to="/travellers"
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/travellers") ? "text-main" : ""
                  }`}
                >
                  Travellers
                </Link>
              </div>
            )}
          </div>
        )}
        {localStorage.getItem("userRole") == "Agent" ||
        localStorage.getItem("userRole") == "Team Lead" ? null : (
          <div>
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleAccordion("itinerary")}
            >
              <span className={`flex justify-start gap-3 items-center`}>
                <MdOutlineLibraryAdd className="w-5 h-5"/>
                Itinerary Library
              </span>
              <span className="text-sm">{openAccordion.includes("itinerary") ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </div>
            {openAccordion.includes("itinerary") && (
              <div className="pl-4">
                <Link
                  to="/travel-summery" // Link updated to '//travel-summery'
                  className={`block p-2 pl-7 hover:text-main ${
                    isActive("/travel-summery") ? "text-main" : "" // Adjusted active state
                  }`}
                >
                  Travel Summary
                </Link>
                <Link
                  to="/activity" // Link updated to '/activity'
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/activity") ? "text-main" : ""
                  }`}
                >
                  Activities
                </Link>
                <Link
                  to="/inclusion" // Link updated to '/inclusion'
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/inclusion") ? "text-main" : ""
                  }`}
                >
                  Inclusion
                </Link>
                <Link
                  to="/exclusion" // Link updated to '/exclusion'
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/exclusion") ? "text-main" : ""
                  }`}
                >
                  Exclusion
                </Link>
                <Link
                  to="/transfer" // Link updated to '/transfer'
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/transfer") ? "text-main" : ""
                  }`}
                >
                  Transfer
                </Link>
                <Link
                  to="/other-information" // Link updated to '/other-information'
                  className={`block p-2  pl-7 hover:text-main ${
                    isActive("/other-information") ? "text-main" : ""
                  }`}
                >
                  Other Information
                </Link>
              </div>
            )}
          </div>
        )}

        {localStorage.getItem("userRole") == "Agent" ? (
          <Link
            to="/travellers" // Link updated to '/other-information'
            className={`block p-2 flex justify-start items-center gap-2 p-2 pl-4 hover:text-main ${
              isActive("/travellers") ? "text-main" : ""
            }`}
          >
            <MdOutlinePeople className="h-5 w-5" /> Traveller
          </Link>
        ) : null}

        {localStorage.getItem("userRole") == "Team Lead" ? (
          <Link
            to="/agent" // Link updated to '/other-information'
            className={`block p-2 flex justify-start items-center gap-2 p-2 pl-4 hover:text-main ${
              isActive("/agent") ? "text-main" : ""
            }`}
          >
            <MdCardTravel className="h-5 w-5" /> Agent
          </Link>
        ) : null}

        <Link
          to="/quote" // Link updated to '/other-information'
          className={`block p-2 flex justify-start items-center gap-2 p-2 pl-4 hover:text-main ${
            isActive("/quote") ? "text-main" : ""
          }`}
        >
          <UserCircleIcon className="h-5 w-5" /> Quote
        </Link>

        <div
          onClick={() => {
            navigate("/signin");
            localStorage.clear();
            window.location.reload()
          }}
          className="mt-2"
        >
          <Link
            // to="/logout" // Link updated to '/other-information'
            className={`block p-2 flex justify-start items-center gap-2 p-2 pl-4 hover:text-main`}
          >
            <PowerIcon className="h-5 w-5" />
            Logout
          </Link>
        </div>

        
      </nav>
    </div>
  );
};

export default Sidebar;
