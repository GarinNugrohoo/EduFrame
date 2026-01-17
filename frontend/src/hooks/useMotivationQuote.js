import { useState, useEffect } from "react";
import { MOTIVATION_QUOTES } from "../constants/quotes";

export const useMotivationQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const today = new Date().getDate();
    const randomIndex = today % MOTIVATION_QUOTES.length;
    setQuote(MOTIVATION_QUOTES[randomIndex]);
  }, []);

  return quote;
};
