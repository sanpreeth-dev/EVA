import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import HoverMedia from "../components/Modals/HoverMedia";
import {
  Heart,
  Brain,
  MessageCircle,
  Shield,
  Star,
  Users,
  Sparkles,

  ArrowRight,
} from "../components/icons/Icons";
import { useState } from "react";
import { motion, AnimatePresence, easeIn, easeInOut } from "framer-motion";

export default function Welcome() {
  const [hover, setHover] = useState(false);
  function handleHover(state) {
    setHover(state);
  }
  useGSAP(() => {
    gsap.from(".head", {
      x: -200,
      opacity: 0,
    });
    gsap.from(".items", {
      x: 200,
      opacity: 0,
    });
  }, []);
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden ">
          <div
            className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}

          <div className="text-center lg:text-left space-y-8 head">
            <div
              className="space-y-4 "
              transition={{
                type: "keyframes",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
              }}
            >
              <h1 className="ml-[-20px] text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
                We are
                <span
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-[length:200%_200%] animate-gradientMove bg-clip-text text-transparent"
                  onMouseEnter={() => handleHover(true)}
                  onMouseLeave={() => handleHover(false)}
                >
                  {" "}
                  EVA
                  <AnimatePresence mode="wait">
                    {hover && (
                      <motion.span
                        key="eva-cap"
                        className="absolute mt-12 text-xs text-gray-500 w-44"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          type: "tween",
                          ease: "easeIn",
                          duration: 0.5,
                        }}
                      >
                        Emotional Virtual Assistant
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </h1>

              <p className="ml-[-10px] text-xl md:text-2xl text-gray-600 max-w-lg">
                An AI that cares
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/avatar" reloadDocument>
                <button className="group bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Talk to EVA
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link to="/userGuide">
                <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                  Start Your Wellness Journey
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} />
                100% Private
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} />
                24/7 Support
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                AI Powered
              </div>
            </div>
          </div>

          {/* Right Content - Virtual Doctor Character */}
          <div className="relative flex justify-center items">
            <div className="relative">
              {/* Main Character Container */}
              <div className="w-96 h-96 md:w-[500px] md:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/30">
                <HoverMedia />
              </div>

              {/* Floating Icons Around Character */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <Heart size={24} className="text-white" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <Brain size={24} className="text-white" />
              </div>
              <div
                className="absolute top-1/2 -left-8 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                style={{ animationDelay: "1.5s" }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How EVA Helps You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets compassionate care for your emotional
              wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                24/7 Conversations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with EVA anytime you need support. No appointments, no
                waiting – just instant, caring conversations.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Personalized Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get tailored mental health insights and coping strategies based
                on your unique emotional patterns.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-100">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Complete Privacy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your conversations are completely private and secure. Share
                openly in a judgment-free environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What People Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from people who found support with EVA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Alex, 19</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "EVA helped me through my anxiety during finals week. Having
                someone to talk to at 3 AM made all the difference."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah, 22</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "I love how EVA remembers our conversations and gives me
                personalized advice. It's like having a therapist in my pocket."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Marcus, 20</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The privacy aspect is amazing. I can be completely honest about
                my feelings without worrying about judgment."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <div className="text-6xl mb-4">💜</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Ready to Start?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take the first step towards better emotional wellness. EVA is
                here to support you every step of the way.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/avatar" reloadDocument>
                <button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Talk to EVA Now
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link to="/about">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                  Learn More
                </button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users size={16} />
                1000+ Users
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                4.9/5 Rating
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                HIPAA Compliant
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
