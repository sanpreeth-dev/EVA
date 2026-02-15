import { Link, useRouteError } from "react-router-dom";
import { Home, AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    // CHANGED: Outer div now has the pink/white gradient and the animation class
    // We use 'from-pink-50 via-white to-pink-100' for a soft mix.
    // Ensure you added the .animate-gradient-slow class to your CSS file!
    <div className="min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100 animate-gradient-slow text-gray-800">
      
      {/* CHANGED: Back to a light, glassy card */}
      <div className="relative z-10 w-full max-w-lg bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 md:p-12 text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* CHANGED: Text back to dark colors */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          Oops!
        </h1>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
          Something went wrong
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {error?.statusText || error?.message || "We couldn't find the page you were looking for."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">
              <Home size={20} />
              Go Home
            </button>
          </Link>

          {/* CHANGED: Secondary button back to light theme */}
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-md border border-gray-200 transition-transform transform hover:-translate-y-1"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}