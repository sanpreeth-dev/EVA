import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../utils/user";
import { LogIn } from "lucide-react";

// The XMarkIcon needs to be defined here since it's used by the modal.
const XMarkIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export default function ProfileModal({ user, onClose }) {
    const modalRef = useRef();
    const navigate = useNavigate();
    const { mutate: logout, isPending } = useLogout();

    const handleSignOut = () => {
        logout(null, {
            onSettled: () => {
                navigate("/");
                onClose();
                // Force reload to update RootLayout state since it reads from localStorage on mount
                window.location.reload();
            }
        });
    };



    // Icons for the modal
    const AddIcon = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    );
    const SignOutIcon = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    );

    // Effect to handle closing the modal on outside click or Esc key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return (
        <div className="fixed top-16 right-4 lg:right-8 z-50">
            <div ref={modalRef} className="w-80 backdrop-blur-xl bg-white/60 text-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 p-6 flex flex-col items-center animate-fade-in-down">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <img className="w-20 h-20 rounded-full mb-2 border-2 border-purple-300" src={user.imageUrl} alt="Profile" />
                <h2 className="text-xl font-semibold mb-2">Hi, {user.username || user.name.split(' ')[0]}!</h2>
                <button
                    onClick={() => navigate("/account")}
                    className="w-full text-sm py-2 px-4 bg-white/50 border border-gray-300 rounded-full hover:bg-gray-200/50 transition-colors duration-200">
                    Manage your Account
                </button>
                <div className="w-full my-6 border-t border-gray-200" />

                <button
                    onClick={handleSignOut}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-200/50 transition-colors duration-200 text-red-500 hover:text-red-700">
                    <SignOutIcon /> {isPending ? "Signing out..." : "Sign out"}
                </button>
            </div>
        </div>
    );
};

