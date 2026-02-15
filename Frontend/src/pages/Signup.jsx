import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import gsap from "gsap";
import InputField from "../components/Inputfield";
import PasswordStrengthMeter from "../components/PasswordStrong";
import StatusMessage from "../components/StatusMsg";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { useRegister } from "../utils/user";

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [error, setError] = useState(''); // Managed by mutation
    // const [loading, setLoading] = useState(false); // Managed by mutation
    const [success, setSuccess] = useState(false);

    const scope = useRef(null);
    const buttonRef = useRef(null); // Ref for the button animation

    const navigate = useNavigate();
    const { mutate: register, isPending, isError, error: registerError } = useRegister();

    // --- GSAP Animations using standard useEffect ---
    useGSAP(() => {
        if (!scope.current || typeof gsap === 'undefined') {
            console.warn("GSAP is not available. Animations skipped.");
            return;
        }
        const ctx = gsap.context(() => {
            gsap.from(".form-card", { opacity: 0, y: 50, scale: 0.95, duration: 1, ease: "power3.out" });
            gsap.from(".gsap-item", { opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: "power2.out", delay: 0.4 });

            // Add the continuous "pop" animation to the button
            if (buttonRef.current) {
                gsap.to(buttonRef.current, {
                    scale: 1.05,
                    duration: 0.7,
                    ease: "power1.inOut",
                    yoyo: true, // Animates back and forth
                    repeat: -1, // Repeats indefinitely
                    delay: 1
                });
            }
        }, scope);
        return () => ctx.revert();
    }, []);

    // --- Form Validation ---
    const validateForm = () => {
        if (!name || !email || !password || !confirmPassword) {
            return 'All fields are required.';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return '';
    };

    // --- Sign-Up Logic (Frontend Only) ---
    const handleSignUp = (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            // setError(validationError); // see comment in Login.jsx
            alert(validationError);
            return;
        }

        // setLoading(true);
        // setError('');
        // setSuccess(false);

        register(
            { username: name, email, password },
            {
                onSuccess: () => {
                    setSuccess(true);
                    // setLoading(false);
                    console.log("Form Submitted:", { name, email });
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    // Redirect
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                }
            }
        )
    };

    // --- Render Logic ---
    return (
        <div className="min-h-screen font-sans flex items-center justify-center p-4 bg-transparent" ref={scope}>

            <div className="relative z-10 w-full max-w-md form-card">
                <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-500 hover:shadow-purple-300/50">

                    <div className="text-center mb-8">
                        <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-2 gsap-item" />
                        <h1 className="text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 gsap-item">
                            Join EVA
                        </h1>
                        <p className="text-gray-500 mt-1 gsap-item">Create your account to begin your journey.</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSignUp} className="space-y-5">
                            <InputField id="name" label="Name" Icon={User} type="text" placeholder="Your Name" value={name} onChange={setName} />
                            <InputField id="email" label="Email" Icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
                            <InputField id="password" label="Password" Icon={Lock} type="password" placeholder="Password (min 8 characters)" value={password} onChange={setPassword}>
                                <PasswordStrengthMeter password={password} />
                            </InputField>
                            <InputField id="confirmPassword" label="Confirm Password" Icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />

                            {(isError) && (
                                <StatusMessage type="error" message={registerError?.message || "Registration failed"} />
                            )}

                            <button ref={buttonRef} type="submit" disabled={isPending} className={`w-full flex items-center justify-center gap-2 pt-3 pb-3 mt-4 font-bold rounded-xl text-white shadow-lg transition-all duration-300 transform ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] shadow-pink-500/50'}`}>
                                {isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating Account...
                                    </>
                                ) : 'Sign Up'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <StatusMessage type="success" message="Account created successfully! Welcome to EVA." />
                        </div>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-8 gsap-item">
                        Already have an account? <Link to="/login" className="font-semibold text-purple-600 hover:underline">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

