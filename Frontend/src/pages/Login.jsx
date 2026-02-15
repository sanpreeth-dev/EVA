import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/Inputfield";
import StatusMessage from "../components/StatusMsg";
import { Mail, Lock, LogIn } from "lucide-react";
import { useLogin } from "../utils/user";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(""); // Managed by mutation
  // const [loading, setLoading] = useState(false); // Managed by mutation
  const [success, setSuccess] = useState(false);

  const scope = useRef(null);
  const buttonRef = useRef(null); // Ref for the button animation

  const navigate = useNavigate();
  const { mutate: login, isPending, isError, error: loginError } = useLogin();

  // --- GSAP Animations using standard useEffect ---
  useGSAP(() => {
    if (!scope.current || typeof gsap === "undefined") {
      console.warn("GSAP is not available. Animations skipped.");
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(".form-card", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".gsap-item", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.4,
      });

      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.7,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, scope);
    return () => ctx.revert();
  }, []);

  // --- Form Validation ---
  const validateForm = () => {
    if (!username || !password) {
      return "Both email and password are required.";
    }
    return "";
  };

  // --- Login Logic (Frontend Only) ---
  const handleLogin = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      // Manually set error is tricky with just mutation state, 
      // but for simplicity we relies on mutation error or just alert for now 
      // OR we can keep local error state for validation ONLY.
      alert(validationError);
      return;
    }

    login(
      { username, password }, // Backend uses 'username' but form considers it 'email' often. Check backend/routes/user.js: line 38 uses req.body.username. 
      // If user inputs email as username, that's fine.
      {
        onSuccess: () => {
          setSuccess(true);
          console.log("Login Submitted:", { username });
          setUsername("");
          setPassword("");
          // Redirect after a short delay to show success message
          setTimeout(() => {
            navigate("/"); // or /avatar
          }, 1500);
        },
      }
    );
  };

  // --- Render Logic ---
  return (
    <div
      className="min-h-screen font-sans flex items-center justify-center p-4 bg-transparent"
      ref={scope}
    >


      <div className="relative z-10 w-full max-w-md form-card">
        <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-500 hover:shadow-purple-300/50">
          <div className="text-center mb-8">
            <LogIn className="w-10 h-10 text-purple-600 mx-auto mb-2 gsap-item" />
            <h1 className="text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 gsap-item">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-1 gsap-item">
              Log in to continue your journey with EVA.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <InputField
                id="username"
                label="Username" // Changed label
                Icon={Mail}
                type="text" // generic text for username
                placeholder="Username"
                value={username}
                onChange={setUsername}
              />
              <InputField
                id="password"
                label="Password"
                Icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />

              {(isError) && (
                <StatusMessage type="error" message={loginError?.message || "Login failed"} />
              )}

              <p className="text-right text-sm text-gray-500 hover:text-purple-600 hover:underline cursor-pointer gsap-item">
                Forgot Password?
              </p>

              <button
                ref={buttonRef}
                type="submit"
                disabled={isPending}
                className={`w-full flex items-center justify-center gap-2 pt-3 pb-3 mt-2 font-bold rounded-xl text-white shadow-lg transition-all duration-300 transform ${isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] shadow-pink-500/50"
                  }`}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <StatusMessage
                type="success"
                message="Login successful! Redirecting..."
              />
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-8 gsap-item">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-600 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
