import { Link } from "react-router-dom"
import ConnectWallet from "./ConnectWallet"

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600">MediChain AI</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/diagnose" className="hover:text-blue-600">Diagnose</Link>
        <Link to="/report" className="hover:text-blue-600">Report</Link>
        <Link to="/profile" className="hover:text-blue-600">Profile</Link>
        <ConnectWallet />
      </div>
    </nav>
  )
}

export default Navbar
