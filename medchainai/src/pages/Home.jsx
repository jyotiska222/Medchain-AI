import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaRobot, FaArrowRight, FaShieldAlt, FaChartLine, FaUserShield } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 10,
        duration: 0.8
      }
    }
  };

  const features = [
    {
      icon: <FaRobot className="text-3xl" />,
      title: "Advanced AI Diagnosis",
      description: "Our deep learning models analyze symptoms with 95% clinical accuracy, trained on millions of medical cases.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <FaLock className="text-3xl" />,
      title: "Blockchain Security",
      description: "End-to-end encrypted health records stored on decentralized blockchain networks.",
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Real-time Analytics",
      description: "Track your health trends over time with personalized insights and predictions.",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: <FaUserShield className="text-3xl" />,
      title: "Privacy First",
      description: "You own your health data. Share selectively with providers when needed.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <main className="bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-20 blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-teal-300 to-blue-300 opacity-20 blur-3xl animate-float-delay"></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-20 blur-3xl animate-float"></div>
        </div>

        <AnimatePresence>
          <motion.div
            className="max-w-5xl mx-auto px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Revolutionizing Healthcare
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Smarter Healthcare <br className="hidden sm:block" /> Powered by AI
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
              variants={itemVariants}
            >
              Instant, accurate medical insights with blockchain-protected health records. 
              Your personal AI health assistant available 24/7.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <button
                onClick={() => navigate("/diagnose")}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button
                onClick={() => navigate("/about")}
                className="group relative border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300"
              >
                How It Works
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Why Choose MediChain AI Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Future of <span className="text-blue-600">Healthcare</span> is Here
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              MediChain AI combines cutting-edge technology with medical expertise to deliver unparalleled healthcare solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                whileHover={{ y: -8, scale: 1.02 }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-14 h-14 flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12" data-aos="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Trusted by Medical Professionals
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                Clinical-Grade AI You Can Trust
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Our models are developed in collaboration with board-certified physicians and trained on diverse, 
                representative medical data to ensure reliable, unbiased results.
              </p>
              <button
                onClick={() => navigate("/about#technology")}
                className="inline-flex items-center text-blue-600 font-medium group"
              >
                Learn About Our Technology
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-center px-4 sm:px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" data-aos="zoom-in">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-blue-100 text-lg mb-8" data-aos="zoom-in" data-aos-delay="150">
            Join thousands of users who trust MediChain AI for their health needs.
          </p>
          <motion.button
            onClick={() => navigate("/diagnose")}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition flex items-center gap-2 mx-auto font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            Start Your Free Diagnosis
            <FaArrowRight />
          </motion.button>
        </div>
      </section>
    </main>
  );
}

export default Home;