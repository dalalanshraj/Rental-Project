import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    show: false,
    message: "",
  });

  const showModal = (message) => {
    setModal({ show: true, message });

    setTimeout(() => {
      setModal({ show: false, message: "" });
    }, 2000);
  };

  const closeModal = () => {
    setModal({ show: false, message: "" });
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}

      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center 
                        bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">

          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 text-center
                          transform transition-all duration-300
                          animate-scaleIn">

            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Notice
            </h2>

            <p className="text-gray-700 mb-6 text-xl">
              {modal.message}
            </p>

            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-6 py-2 rounded-lg 
                         hover:bg-red-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);