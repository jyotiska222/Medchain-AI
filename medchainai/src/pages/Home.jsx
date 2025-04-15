function Home() {
    return (
      <section className="text-center py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">AI-Powered Health Diagnosis</h1>
        <p className="text-lg text-gray-600 mb-6">
          Get quick, accurate disease predictions with medicine recommendations.
          Your data is protected with blockchain.
        </p>
        <a href="/diagnose">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Get Diagnosed
          </button>
        </a>
      </section>
    )
  }
  
  export default Home
  