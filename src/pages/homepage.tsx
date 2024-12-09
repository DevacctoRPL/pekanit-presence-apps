import React, { useEffect, useState } from "react";
// Gambar yang berada di dalam folder public
import rplgacor from "../assets/rplgacor.png"; // Sesuaikan dengan struktur folder Anda

import {
  Code,
  Network,
  Camera as ImageIcon,
  CircleDollarSign,
  X,
  RefreshCw,
  LogOut,
  User,
  ListCheckIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from "framer-motion";

// Definisi tipe untuk Kredensial dan Detail Jurusan
interface Credential {
  nama: string;
  kelas: string;
  nisn: string;
}

interface DepartmentDetail {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  fullDescription: string;
  primaryColor: string;
}

// Data Jurusan
const departments: DepartmentDetail[] = [
  {
    id: 1,
    name: "RPL",
    icon: <Code className="w-24 h-24 text-white" />,
    description: "Rekayasa Perangkat Lunak",
    fullDescription:
      "Jurusan RPL fokus pada pengembangan perangkat lunak, pemrograman, dan solusi teknologi informasi.",
    primaryColor: "#48737B",
  },
  {
    id: 2,
    name: "TKJ",
    icon: <Network className="w-24 h-24 text-white" />,
    description: "Teknik Komputer dan Jaringan",
    fullDescription:
      "Jurusan TKJ mempelajari infrastruktur jaringan komputer, keamanan sistem, dan administrasi jaringan.",
    primaryColor: "#922218",
  },
  {
    id: 3,
    name: "MM",
    icon: <ImageIcon className="w-24 h-24 text-white" />,
    description: "Multimedia",
    fullDescription:
      "Jurusan Multimedia mengembangkan keterampilan desain grafis, animasi, dan produksi konten digital.",
    primaryColor: "#29346F",
  },
  {
    id: 4,
    name: "PKM",
    icon: <CircleDollarSign className="w-24 h-24 text-white" />,
    description: "Perbankan Keuangan Mikro",
    fullDescription:
      "Jurusan PKM fokus pada produksi konten media, broadcast, dan pengembangan kreativitas komunikasi.",
    primaryColor: "#DDCF52",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [kelas, setKelas] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const x = useMotionValue(0);
  const dragControls = useDragControls();

  // [Tetap gunakan fungsi-fungsi sebelumnya seperti useEffect, handleGenerate, dll]

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    const { offset } = info;
    
    // Threshold untuk swipe (misal 100 pixel)
    if (offset.x < -100) {
      // Swipe ke kanan (next slide)
      setCurrentSlide((prev) => (prev + 1) % departments.length);
    } else if (offset.x > 100) {
      // Swipe ke kiri (prev slide)
      setCurrentSlide((prev) => (prev - 1 + departments.length) % departments.length);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    const credentialString = Cookies.get("credential");

    if (!token || !credentialString) {
      navigate("/login");
      return;
    }

    try {
      const credential: Credential = JSON.parse(credentialString);
      setName(credential.nama);
      setKelas(credential.kelas);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error("Error parsing credentials:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const credentialString = Cookies.get("credential");
      if (!credentialString) {
        setError("Credentials not found");
        return;
      }

      const credential: Credential = JSON.parse(credentialString);

      const { data } = await axios.post(
        "https://db66-103-249-19-73.ngrok-free.app/api/generate-queue",
        {
          nisn: credential.nisn,
          kelas: credential.kelas,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.status === "success" && data.data?.nomor_antrian !== undefined) {
        setResult(data.data.nomor_antrian);
      } else {
        setError("Gagal mendapatkan nomor antrian");
        setResult(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Terjadi kesalahan saat generate nomor"
        );
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("credential");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handleCardClick = (id: number) => {
    setActiveCard(id);
  };

  const handleCloseModal = () => {
    setActiveCard(null);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % departments.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + departments.length) % departments.length
    );
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-white font-sans relative">
      {/* Header Mobile */}
      <header className="bg-[#2C3646] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsProfileOpen(true)}>
            <User className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold"></h1>
        </div>
        {/* Letakkan gambar di tengah navbar */}
        <div className="flex justify-center flex-grow">
          <img
            src={rplgacor}
            alt="Logo Pekan IT"
            className="h-12" // Menyesuaikan tinggi gambar
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/40 transition-colors duration-300 p-2 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
          >
            <motion.div
              className="bg-[#2C3646] rounded-2xl w-full max-w-md p-6 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Profil Siswa</h2>
              <div className="bg-[#3B4856] rounded-lg p-4">
                <p className="text-lg">{name}</p>
                <p className="text-gray-300">{kelas}</p>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="mt-4 bg-[#4A5A6A] hover:bg-[#62929A] px-4 py-2 rounded-lg"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nomor Antrian Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-[#2C3646] rounded-xl shadow-lg p-6 text-center">
          <ListCheckIcon className="mx-auto w-16 h-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-4">Generate Nomor Antrian</h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#4A5A6A] hover:bg-[#62929A] transition-colors duration-300 px-4 py-3 rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <RefreshCw className="mr-2 animate-spin" />
            ) : (
              "Generate Nomor Antrian"
            )}
          </button>

          {loading && <p className="mt-4 text-gray-300">Generating...</p>}

          {result !== null && (
            <div className="mt-4">
              <p className="text-lg text-gray-400 mb-2">Nomor Antrian Anda:</p>
              <p className="text-5xl font-bold text-white">{result}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto mt-4 px-4">
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        </div>
      )}

 {/* Slider Container */}
 <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden mt-8">
        <motion.div
          className="flex items-center justify-center w-full touch-pan-y"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {departments.map((dept, index) => {
            const offset = (index - currentSlide + departments.length) % departments.length;
            const transformStyle = 
              offset === 0 
                ? "scale-100 opacity-100 z-20 translate-x-0" : 
              offset === 1 || offset === departments.length - 1
                ? "scale-90 opacity-70 z-10 translate-x-20" : 
                "scale-75 opacity-50 z-0 translate-x-40";

            return (
              <motion.div
                key={dept.id}
                drag="x"
                dragControls={dragControls}
                onDragEnd={handleDragEnd}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                className={`absolute w-[350px] h-[500px] ${transformStyle} transition-all duration-500 ease-in-out rounded-xl cursor-pointer`}
                onClick={() => handleCardClick(dept.id)}
                style={{ 
                  backgroundColor: dept.primaryColor,
                  x: x
                }}
              >
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  {dept.icon}
                  <h2 className="text-2xl font-bold mt-6">{dept.name}</h2>
                  <p className="text-gray-200 mt-2">{dept.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>


      {/* Modal Detail Jurusan */}
      <AnimatePresence>
        {activeCard !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-[#2C3646] rounded-2xl w-[600px] p-8 relative text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X />
              </button>

              <div className="flex flex-col items-center">
                {departments.find((d) => d.id === activeCard)?.icon}
                <h2 className="text-3xl font-bold mt-4">
                  {departments.find((d) => d.id === activeCard)?.name}
                </h2>
                <p className="text-gray-300 mt-2 text-center">
                  {
                    departments.find((d) => d.id === activeCard)
                      ?.fullDescription
                  }
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
