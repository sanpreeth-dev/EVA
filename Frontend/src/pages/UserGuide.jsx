import { useState } from "react";
import { ScrollTrigger } from "gsap/all";
import StepCard from "../components/stepCard";
import {
  MessageCircle,
  Send,
  Camera,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,

} from "../components/icons/Icons";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ImageSlideshow from "../components/Modals/SlideShow";

export default function UserGuide() {
  const [characterName, setCharacterName] = useState("EVA");
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(min-width: 800px)", () => {
      gsap.to(".image", {
        x: 350,
        scale: 1.2,
        scrollTrigger: {
          trigger: ".image",
          start: "top 53%",
          end: "bottom bottom",
          scrub: 2
        },
        ease: "power1.inOut",
      });
    });
    gsap.utils.toArray(".card,footer").forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll(".card-text"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-transparent"></div>
      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left side */}
        <div
          className="absolute top-10 left-0 w-20 h-20 bg-purple-200 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute bottom-20 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Right side */}
        <div
          className="absolute top-32 right-0 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-10 right-0 w-40 h-40 bg-yellow-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Optional extra side bubbles */}
        <div
          className="absolute top-1/2 left-0 w-14 h-14 bg-pink-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-20 h-20 bg-purple-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.8s" }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className=" text-center py-12 px-6 card">
          <div className="card-text flex items-center justify-center gap-3 mb-6">
            <span
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-[length:200%_200%] animate-gradientMove bg-clip-text text-transparent"
            >
              {" "}
              EVA
            </span>
          </div>
          <p className="card-text text-2xl md:text-3xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Emotional Virtual Assistant
          </p>
          <div className="w-24 h-1 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-full mx-auto mt-8"></div>
        </header>

        {/* Steps Container */}
        <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">
          {/* Step 1 */}

          <StepCard
            className="card"
            stepNumber={1}
            title="Meet EVA – Your Personal Therapist"
            description="They can chat, talk and respond empathetically."
            icon={Heart}
          >
            <div className="card-text flex flex-col md:flex-row image items-center gap-6 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl border border-white/20 max-w-lg mx-auto lg:mx-0 w-full">
              <div className="w-56 h-56 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <ImageSlideshow onChange={setCharacterName} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{characterName}</h3>
                <p className="text-gray-500">AI Therapist</p>
                <div className="flex gap-1 mt-2">
                  <div className="mt-[7px] w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 text-sm">Online</span>
                </div>
              </div>
            </div>
          </StepCard>

          {/* Step 2 */}
          <StepCard
            className="card"
            stepNumber={2}
            title="Type Your Message"
            description="You can share, ask, or discuss anything privately and securely."
            icon={MessageCircle}
          >
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-4 shadow-xl">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none text-gray-700 text-lg"
                  readOnly
                />
              </div>
              <div className="flex items-center gap-2 mt-4 text-gray-600">
                <Shield className="w-5 h-5" />
                <span className=" card-text text-sm">
                  Private & Secure Conversation
                </span>
              </div>
            </div>
          </StepCard>

          {/* Step 3 */}
          <StepCard
            stepNumber={3}
            className="card"
            title="Send Your Message"
            description="Click the button to send it to EVA."
            icon={Send}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 max-w-md mx-auto lg:mx-0">
              <ArrowRight className="w-8 h-8 text-gray-500" />
              <button className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 hover:opacity-90 px-8 py-4 rounded-2xl text-gray-800 font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3">
                <Send className="w-5 h-5" />
                SEND
              </button>
            </div>
          </StepCard>

          {/* Step 4 */}
          <StepCard
            stepNumber={4}
            className="card"
            title="Share Images or Take Live Photos"
            description="Upload an image from your computer or snap a live picture with your webcam."
            icon={Camera}
          >
            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-800" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-500" />
                <button className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 hover:opacity-90 px-6 py-3 rounded-2xl text-gray-800 font-semibold shadow-xl transform hover:scale-105 transition-all duration-200">
                  Choose Image
                </button>
              </div>
              <div className="card-text text-gray-600 text-sm">
                Click the camera icon next to the input box to upload images or
                take live photos
              </div>
            </div>
          </StepCard>

          {/* Step 5 */}
          <StepCard
            stepNumber={5}
            className="card"
            title="Enjoy Your Conversation"
            description="Feel free to interact and explore EVA's features. She's here to  understand and support you."
            icon={Sparkles}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 ">
              {[
                "Empathetic",
                "Private",
                "Available 24/7",
                "Understanding",
                "Supportive",
                "Safe Space",
              ].map((feature) => (
                <div
                  key={feature}
                  className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 border border-white/20 shadow-2xl hover:opacity-90"
                >
                  <span className="text-gray-800 font-medium text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </StepCard>
        </div>

        {/* Footer */}
        <footer className=" text-center py-12 px-6">
          <div className="card-text max-w-2xl mx-auto">
            <h3 className="card-text text-2xl font-bold text-gray-800 mb-4">
              Ready to Chat?
            </h3>
            <p className="card-text text-gray-600 mb-8">
              EVA is waiting to have a meaningful conversation with you.
            </p>
            <Link to="/avatar" reloadDocument>
              <button className="group mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Start Chatting with EVA
              </button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
