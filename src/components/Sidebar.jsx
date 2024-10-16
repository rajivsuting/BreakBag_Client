import React, { useCallback } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavLink, useLocation } from "react-router-dom";
import { PiUploadDuotone } from "react-icons/pi";
import { useAccordion } from "../context/AccordionContext"; // Import the custom hook
import { MdChevronLeft } from "react-icons/md";

const Sidebar = () => {
  const { openAccordion, setOpenAccordion } = useAccordion();
  const location = useLocation();

  // Function to toggle accordion open state
  const toggleAccordion = useCallback((value) => {
    setOpenAccordion((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, [setOpenAccordion]);

  // Function to check if the link is active
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
  <div className="m-auto mb-2">
    <Typography variant="h5" color="blue-gray">
      <img
        src="https://breakbag.com/static/media/logo.3fff3126fefbf4f3afe7.png"
        alt="Logo"
        className="w-42 h-14"
      />
    </Typography>
  </div>
      <List className="sidebar overflow-y-scroll h-[100vh]">
        {/* Dashboard Accordion */}

        {localStorage.getItem("userRole") == "Agent" || localStorage.getItem("userRole") == "Team Lead" ? null :
        <Accordion open={openAccordion.includes("dashboard")}>
          <ListItem
            className="p-0"
            onClick={() => toggleAccordion("dashboard")}
          >
            <AccordionHeader className="border-b-0 p-3 flex justify-between items-center">
              <div className="w-[70%] flex items-center">
                <ListItemPrefix>
                  <PresentationChartBarIcon
                    className={`h-5 w-5 ${
                      isActive("/agent") ||
                      isActive("/destination") ||
                      isActive("/travellers")
                        ? "text-main"
                        : "text-blue-gray"
                    }`}
                  />
                </ListItemPrefix>
                <Typography
                  color={
                    isActive("/agent") ||
                    isActive("/destination") ||
                    isActive("/travellers")
                      ? "red"
                      : "blue-gray"
                  }
                  className="mr-auto font-normal"
                >
                  Dashboard
                </Typography>
              </div>
              {/* Arrow Icon */}
              <div>
                <ChevronDownIcon
                  className={`h-3 w-3 transition-transform ${
                    openAccordion.includes("dashboard") ? "rotate-180" : ""
                  }`}
                />
              </div>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <NavLink to={"/agent"}>
                <ListItem className={isActive("/agent") ? "text-red-500" : ""}>
                  <ListItemPrefix>
                    <MdChevronLeft className="h-5 w-5" />
                  </ListItemPrefix>
                  Agents & Team leads
                </ListItem>
              </NavLink>
              
              <NavLink to={"/destination"}>
                <ListItem
                  className={isActive("/destination") ? "text-red-500" : ""}
                >
                  <ListItemPrefix>
                    <MdChevronLeft className="h-5 w-5" />
                  </ListItemPrefix>
                  Destination
                </ListItem>
              </NavLink>
              <NavLink to={"/travellers"}>
                <ListItem
                  className={isActive("/travellers") ? "text-red-500" : ""}
                >
                  <ListItemPrefix>
                    <MdChevronLeft className="h-5 w-5" />
                  </ListItemPrefix>
                  Travellers
                </ListItem>
              </NavLink>
            </List>
          </AccordionBody>
        </Accordion> }

        {/* Itinerary Library Accordion */}
        {localStorage.getItem("userRole") == "Agent" || localStorage.getItem("userRole") == "Team Lead"  ? null :
        <Accordion open={openAccordion.includes("itinerary")}>
          <ListItem
            className="p-0"
            onClick={() => toggleAccordion("itinerary")}
          >
            <AccordionHeader className="border-b-0 p-3 flex justify-between items-center">
              <div className="w-[70%] flex items-center">
                <ListItemPrefix>
                  <ShoppingBagIcon
                    className={`h-5 w-5 ${
                      isActive("/travel-summery") ||
                      isActive("/activity") ||
                      isActive("/inclusion") ||
                      isActive("/exclusion") ||
                      isActive("/transfer") ||
                      isActive("/other-information")
                        ? "text-main"
                        : "text-blue-gray"
                    }`}
                  />
                </ListItemPrefix>
                
                  <Typography
                    color={
                      isActive("/travel-summery") ||
                      isActive("/activity") ||
                      isActive("/inclusion") ||
                      isActive("/exclusion") ||
                      isActive("/transfer") ||
                      isActive("/other-information")
                        ? "red"
                        : "blue-gray"
                    }
                    className="mr-auto font-normal"
                  >
                    Itinerary Library
                  </Typography>
               
              </div>
              {/* Arrow Icon */}
              <ChevronDownIcon
                className={`h-3 w-3 transition-transform ${
                  openAccordion.includes("itinerary") ? "rotate-180" : ""
                }`}
              />
            </AccordionHeader>
          </ListItem>

        
            <AccordionBody className="py-1">
              <List className="p-0">
                <NavLink to={"/travel-summery"}>
                  <ListItem
                    className={
                      isActive("/travel-summery") ? "text-red-500" : ""
                    }
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Travel Summary
                  </ListItem>
                </NavLink>
                <NavLink to={"/activity"}>
                  <ListItem
                    className={isActive("/activity") ? "text-red-500" : ""}
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Activities
                  </ListItem>
                </NavLink>
                <NavLink to={"/inclusion"}>
                  <ListItem
                    className={isActive("/inclusion") ? "text-red-500" : ""}
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Inclusion
                  </ListItem>
                </NavLink>
                <NavLink to={"/exclusion"}>
                  <ListItem
                    className={isActive("/exclusion") ? "text-red-500" : ""}
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Exclusion
                  </ListItem>
                </NavLink>
                <NavLink to={"/transfer"}>
                  <ListItem
                    className={isActive("/transfer") ? "text-red-500" : ""}
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Transfers
                  </ListItem>
                </NavLink>
                <NavLink to={"/other-information"}>
                  <ListItem
                    className={
                      isActive("/other-information") ? "text-red-500" : ""
                    }
                  >
                    <ListItemPrefix>
                      <MdChevronLeft className="h-5 w-5" />
                    </ListItemPrefix>
                    Other Information
                  </ListItem>
                </NavLink>
              </List>
            </AccordionBody>
      
        </Accordion> 
        }

        {/* Other Links */}

        {localStorage.getItem("userRole") == "Agent" ? <NavLink to={"/travellers"}>
          <ListItem className={isActive("/travellers") ? "text-red-500" : ""}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Traveller
          </ListItem>
        </NavLink> : null}

        {localStorage.getItem("userRole") == "Team Lead" ? <NavLink to={"/agent"}>
          <ListItem className={isActive("/agent") ? "text-red-500" : ""}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Agents
          </ListItem>
        </NavLink> : null}


        <NavLink to={"/quote"}>
          <ListItem className={isActive("/quote") ? "text-red-500" : ""}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quote
          </ListItem>
        </NavLink>
        
        <NavLink to={"/logout"}>
          <ListItem className={isActive("/logout") ? "text-red-500" : ""}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Logout
          </ListItem>
        </NavLink>
      </List>
    </div>
  );
};

export default Sidebar;
