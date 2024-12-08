import { useState, FormEvent } from 'react'
import axios from 'axios' // Pastikan sudah install axios: npm install axios
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

interface LoginResponse {
  token?: string
  message?: string
}

const Login = () => {
  const navigate = useNavigate();
  // const [nisn, setnisn] = useState('')
  // const [password, setPassword] = useState('')
  // const [kelas, setkelas] = useState('')
 const [nomor_pendaftaran, setNomorPendaftaran] = useState('')
 const [pin, setPin] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      const response = await axios.post(
        'https://49kdgk28-4173.asse.devtunnels.ms/api/users/login/auth', 
        {
          nomor_pendaftaran,
          pin, 
        },
        {
          withCredentials: true // Penting untuk mengirim cookies
        }
      )
  
      // Tidak perlu menyimpan token manual
      navigate('/dashboard'); // Redirect ke halaman dashboard
    } catch (err) {
      console.log(err)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred during login')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">
                nisn address
              </label>
              <input
                id="nisn-address"
                name="nomor_pendaftaran"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="nisn"
                value={nomor_pendaftaran}
                onChange={(e) => setNomorPendaftaran(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="pin " className="sr-only">
                Kelas
              </label>
              <input
                id="kelas"
                name="pin"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={loading}
              />
            </div>
            {/* <div>
              <label htmlFor="password" className="sr-only">
                Kelas
              </label>
              <input
                id="kelas"
                name="kelas"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="kelas"
                value={kelas}
                onChange={(e) => setkelas(e.target.value)}
                disabled={loading}
              />
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
