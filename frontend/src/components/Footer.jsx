import { FaGithub, FaLinkedin, FaTwitter, FaHospital } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaHospital className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">MediChain AI</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Revolutionizing healthcare with AI-powered diagnostics and blockchain-secured medical records.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Quick Links</h3>
          <nav className="space-y-2">
            <Link to="/" className="block hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/diagnose" className="block hover:text-blue-600 transition-colors">Diagnose</Link>
            <Link to="/records" className="block hover:text-blue-600 transition-colors">Medical Records</Link>
            <Link to="/about" className="block hover:text-blue-600 transition-colors">About Us</Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Legal</h3>
          <nav className="space-y-2">
            <Link to="/privacy" className="block hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="block hover:text-blue-600 transition-colors">Cookie Policy</Link>
          </nav>
        </div>

        {/* Contact & Socials */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Connect With Us</h3>
          <div className="space-y-2">
            <p className="text-sm">support@medichain.ai</p>
            <p className="text-sm">+1 (555) 123-4567</p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-gray-800 transition-colors">
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com/company/medichain-ai" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-blue-700 transition-colors">
                <FaLinkedin size={18} />
              </a>
              <a href="https://twitter.com/medichain_ai" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-blue-400 transition-colors">
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MediChain AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p>Powered by AI & Blockchain Technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;