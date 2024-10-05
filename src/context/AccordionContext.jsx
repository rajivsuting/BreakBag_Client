import React, { createContext, useContext, useEffect, useState } from "react";

// Create a Context for the Accordion
const AccordionContext = createContext();

// Custom Hook to use the AccordionContext
export const useAccordion = () => {
  return useContext(AccordionContext);
};

// Provider component to wrap the application
export const AccordionProvider = ({ children }) => {
  const [openAccordion, setOpenAccordion] = useState([]);

  // Load the opened accordion state from localStorage
  useEffect(() => {
    const storedAccordion = JSON.parse(localStorage.getItem("openAccordion"));
    if (storedAccordion) {
      setOpenAccordion(storedAccordion);
    }
  }, []);

  // Save the opened accordion state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("openAccordion", JSON.stringify(openAccordion));
  }, [openAccordion]);

  return (
    <AccordionContext.Provider value={{ openAccordion, setOpenAccordion }}>
      {children}
    </AccordionContext.Provider>
  );
};
