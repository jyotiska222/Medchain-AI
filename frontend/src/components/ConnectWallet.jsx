import { useState, useEffect } from "react"

function ConnectWallet() {
  const [account, setAccount] = useState(null)

  const connect = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } else {
      alert("Please install MetaMask!")
    }
  }

  return (
    <button
      onClick={connect}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {account ? account.slice(0, 6) + "..." + account.slice(-4) : "Connect Wallet"}
    </button>
  )
}

export default ConnectWallet
