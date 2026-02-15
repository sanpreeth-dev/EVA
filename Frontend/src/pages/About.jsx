import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- SVG Icons for feature highlights ---

const BrainIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l.259 1.035.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456z"
    />
  </svg>
);

const HeartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5S12 5.765 12 8.25c0 2.485-2.015 4.5-4.5-4.5S3 10.735 3 8.25c0-2.485 2.015-4.5 4.5-4.5S12 5.765 12 8.25z"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c2.485 0 4.5-2.015 4.5-4.5S14.485 12 12 12s-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5z" />
  </svg>
);

const UserGroupIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.742-.586l-1.12-1.942a3.75 3.75 0 0 0-5.256-1.14l-5.962 3.442a3.75 3.75 0 0 0-1.14 5.256l1.942 1.12A9.094 9.094 0 0 0 18 18.72ZM6 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0ZM15 12.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


// --- Team Member Card Component ---
const TeamMemberCard = ({ name, role, imageUrl, bio }) => (
    <div className="team-card bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <img className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md" src={imageUrl} alt={name} />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-purple-600 font-semibold">{role}</p>
        <p className="text-gray-600 mt-2 text-sm">{bio}</p>
    </div>
);


// --- Main About Page Component ---

function About() {
  const team = [
    { name: "Sanpreeth Ranjith", role: "Lead Developer & AI Architect", bio: "The visionary behind EVA, specializing in MERN stack and AI/ML integration. Passionate about creating technology that understands and helps people.", imageUrl: "https://placehold.co/200x200/C4B5FD/3730A3?text=SR" },
    { name: "Manasa", role: "Frontend & UI/UX Specialist", bio: "Crafting beautiful and intuitive user experiences. Manasa ensures that interacting with EVA is always a seamless and pleasant journey.", imageUrl: "https://placehold.co/200x200/FBCFE8/86198F?text=M" },
    { name: "Shayona", role: "Backend Developer", bio: "The engineering powerhouse ensuring EVA's systems are robust, scalable, and secure. Expert in server-side logic and database management.", imageUrl: "https://placehold.co/200x200/A5F3FC/0E7490?text=S" },
    { name: "Rithuraj", role: "Machine Learning Engineer", bio: "Diving deep into neural networks and algorithms to make EVA smarter and more empathetic with every conversation.", imageUrl: "https://placehold.co/200x200/D1FAE5/047857?text=R" },
  ];

  useGSAP(() => {
    // Animate the main header
    gsap.from(".header-anim", {
        duration: 0.8,
        opacity: 0,
        y: -50,
        stagger: 0.2,
        ease: "power3.out",
    });

    // Animate the mission cards on scroll
    gsap.from(".mission-card", {
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".mission-section",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // Animate the mission icons for a more dynamic feel
    gsap.from(".mission-icon", {
      duration: 0.5,
      scale: 0.5,
      opacity: 0,
      delay: 0.4,
      stagger: 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".mission-section",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
    
    // Animate the team section header
     gsap.from(".team-header-anim", {
        duration: 0.8,
        opacity: 0,
        y: -30,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".team-header-anim",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

  }, []);
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="text-center">
            <h1 className="header-anim text-4xl md:text-5xl font-extrabold text-gray-800">
                About <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-[length:200%_200%] animate-gradientMove bg-clip-text text-transparent">EVA</span>
            </h1>
            <p className="header-anim mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                We are a passionate team of innovators and engineers dedicated to building the next generation of artificial intelligence—one that's not just smart, but emotionally intelligent.
            </p>
        </div>

        {/* --- Our Mission Section --- */}
        <div className="mt-20 mission-section">
            <div className="grid md:grid-cols-3 gap-10 text-center">
                <div className="mission-card p-6">
                    <BrainIcon className="mission-icon h-12 w-12 mx-auto text-purple-500"/>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Advanced Technology</h2>
                    <p className="mt-2 text-gray-600">
                        Leveraging the power of the MERN stack and cutting-edge machine learning models, EVA is built on a foundation of robust and scalable technology.
                    </p>
                </div>
                <div className="mission-card p-6">
                    <HeartIcon className="mission-icon h-12 w-12 mx-auto text-pink-500"/>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Human-Centric Design</h2>
                    <p className="mt-2 text-gray-600">
                        Our core philosophy is to create an AI that understands human emotion, providing empathetic and meaningful support to its users.
                    </p>
                </div>
                 <div className="mission-card p-6">
                    <UserGroupIcon className="mission-icon h-12 w-12 mx-auto text-blue-500"/>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Collaborative Spirit</h2>
                    <p className="mt-2 text-gray-600">
                        We believe that the best ideas come from collaboration. Our team's diverse skills and shared vision are the driving force behind EVA's success.
                    </p>
                </div>
            </div>
        </div>
        
        {/* --- Meet the Team Section --- */}
        <div className="mt-20 team-section">
            <h2 className="team-header-anim text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12">
                Meet Our Team
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member) => (
                    <TeamMemberCard key={member.name} {...member} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

export default About;

