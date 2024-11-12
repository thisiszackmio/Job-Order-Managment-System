import { useEffect } from "react";

const AutoLogout = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Optionally add a condition here, like checking if there’s unsaved data.
      event.preventDefault();
      event.returnValue = ""; // Some browsers require this property to show a dialog.
    };

    // Add the `beforeunload` event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // This component is purely for side effects
};

export default AutoLogout;
