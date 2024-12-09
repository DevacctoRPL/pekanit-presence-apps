import React, { useState, FormEvent } from "react";
import KelasModal from "../components/kelasModal";
import { UserCircle, LockKeyhole, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface User {
  nama: string;
  nama_kelas: string;
  nisn: string;
}

interface LoginResponse {
  status: string;
  message: string;
  user: User;
  token: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [kelas, setSelectedKelas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectKelas = (kelas: string) => {
    setSelectedKelas(kelas); // Set the selected class
    closeModal(); // Close the modal after selecting the class
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        "https://db66-103-249-19-73.ngrok-free.app/api/login/auth",
        { nisn, password, kelas },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;
      if (!token) {
        throw new Error("Token is missing in the response.");
      }

      localStorage.setItem("token", token);

      const credentials = {
        nama: user.nama,
        kelas: user.nama_kelas,
        nisn: user.nisn,
      };

      Cookies.set("credential", JSON.stringify(credentials), {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#2C3646] rounded-xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Pekan IT</h2>
          <p className="mt-2 text-sm text-gray-300">
            Selamat datang di Login Siswa
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircle className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              disabled={loading}
              placeholder="NISN"
              className="pl-10 w-full py-3 px-4 bg-[#3B4856] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62929A] transition-all duration-300"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockKeyhole className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={passwordVisible ? "text" : "password"} // Toggle input type based on password visibility
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Password"
              className="pl-10 w-full py-3 px-4 bg-[#3B4856] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62929A] transition-all duration-300"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
            >
              {passwordVisible ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Kelas Selection */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircle className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={kelas || "Pilih Kelas"}
              onClick={openModal} // Open modal on click
              disabled={loading}
              placeholder="Pilih Kelas"
              className="pl-10 w-full py-3 px-4 bg-[#3B4856] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62929A] transition-all duration-300 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A5A6A] text-white rounded-lg hover:bg-[#62929A] focus:outline-none focus:ring-2 focus:ring-[#62929A] transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
        {/* Kelas Modal */}
        <KelasModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectKelas={handleSelectKelas}
        />

        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Created by Devaccto RPL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
