import { useState } from 'react';
import { FaUser, FaNotesMedical, FaHistory, FaPrescriptionBottleAlt, FaFileMedicalAlt } from 'react-icons/fa';
import ConnectWallet from '../components/ConnectWallet';

function Diagnose() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock data (replace with real data from your contracts later)
  const [profile] = useState({
    name: "John Doe",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Type 2 Diabetes"]
  });
  
  const [medicalHistory] = useState([
    { date: "2023-05-15", diagnosis: "Annual checkup - All normal" },
    { date: "2023-02-10", diagnosis: "Flu symptoms - Prescribed rest and fluids" },
    { date: "2022-11-05", diagnosis: "Follow-up for diabetes management" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header with wallet connection */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaUser size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile?.name || 'Anonymous Patient'}</h1>
                <p className="text-blue-100 text-sm">Medical Profile</p>
              </div>
            </div>
            <ConnectWallet />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaUser className="text-lg" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'medical' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaFileMedicalAlt className="text-lg" />
                <span>Medical Info</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaHistory className="text-lg" />
                <span>History</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-white">
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-500" /> Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{profile?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Type</p>
                      <p className="font-medium">{profile?.bloodType || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaNotesMedical className="mr-2 text-blue-500" /> Health Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Checkup</p>
                      <p className="font-medium">May 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Primary Physician</p>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaPrescriptionBottleAlt className="mr-2 text-blue-500" /> Allergies
                  </h3>
                  {profile?.allergies?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {profile.allergies.map((allergy, index) => (
                        <li key={index} className="font-medium">{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No allergies recorded</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaFileMedicalAlt className="mr-2 text-blue-500" /> Conditions
                  </h3>
                  {profile?.conditions?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {profile.conditions.map((condition, index) => (
                        <li key={index} className="font-medium">{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No conditions recorded</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FaHistory className="mr-2 text-blue-500" /> Diagnosis History
                </h3>
                
                {medicalHistory.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {medicalHistory.map((record, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{record.diagnosis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No diagnosis history found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnose;