import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Credential {
  nama: string;
  kelas: string;
  nisn: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [kelas, setKelas] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    const credentialString = Cookies.get('credential');

    if (!token || !credentialString) {
      navigate('/login');
      return;
    }

    try {
      const credential: Credential = JSON.parse(credentialString);
      setName(credential.nama);
      setKelas(credential.kelas);
      
      // Set authorization header for all subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error('Error parsing credentials:', err);
      navigate('/login');
    }
  }, [navigate]);

const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      // Get the credential from cookies
      const credentialString = Cookies.get('credential');
      if (!credentialString) {
        setError('Credentials not found');
        return;
      }
      
      const credential: Credential = JSON.parse(credentialString);
      console.log(credential)
      console.log(credential.nisn)
      console.log(credential.kelas)

      const { data } = await axios.post(
        ' https://056f-202-51-199-226.ngrok-free.app/api/generate-queue',
        {
          nisn: credential.nisn, // Use the nisn from parsed credential
          kelas: credential.kelas
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.status === 'success' && data.data?.nomor_antrian !== undefined) {
        setResult(data.data.nomor_antrian);
      } else {
        setError('Gagal mendapatkan nomor antrian');
        setResult(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Terjadi kesalahan saat generate nomor');
      } else {
        setError('Terjadi kesalahan yang tidak diketahui');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
};


  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    Cookies.remove('credential');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Halo, {name || 'Tamu'}
                </h1>
                <p className="mt-2 text-gray-600">
                  Kelas: {kelas}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:bg-blue-300"
            >
              {loading ? 'Generating...' : 'Generate Nomor Antrian'}
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-center">
                {error}
              </div>
            )}

            {(loading || result !== null) && (
              <div className="mt-8 w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  {loading ? (
                    <p className="text-2xl text-gray-600">Generating...</p>
                  ) : (
                    <div>
                      <p className="text-xl text-gray-600 mb-2">Nomor Antrian Anda:</p>
                      <p className="text-6xl font-bold text-gray-900">{result}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
