// AccordionContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AccordionContext = createContext();

export const useAccordion = () => {
  return useContext(AccordionContext);
};

export const AccordionProvider = ({ children }) => {
  const [openAccordion, setOpenAccordion] = useState([]);

  useEffect(() => {
    const storedAccordion = JSON.parse(localStorage.getItem("openAccordion"));
    if (storedAccordion) {
      setOpenAccordion(storedAccordion);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("openAccordion", JSON.stringify(openAccordion));
  }, [openAccordion]);

  return (
    <AccordionContext.Provider value={{ openAccordion, setOpenAccordion }}>
      {children}
    </AccordionContext.Provider>
  );
};
