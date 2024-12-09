import React, { useState } from 'react';
import { X } from 'lucide-react'; // Ikon untuk menutup modal

interface Kelas {
  id: number;
  nama_kelas: string;
}

const kelasList: Kelas[] = [
  { id: 1, nama_kelas: "X-RPL-1" },
  { id: 2, nama_kelas: "X-RPL-2" },
  { id: 3, nama_kelas: "X-TKJ-1" },
  { id: 4, nama_kelas: "X-TKJ-2" },
  { id: 5, nama_kelas: "X-TKJ-3" },
  { id: 6, nama_kelas: "X-DKV-1" },
  { id: 7, nama_kelas: "X-DKV-2" },
  { id: 8, nama_kelas: "X-DKV-3" },
  { id: 9, nama_kelas: "X-DKV-4" },
  { id: 10, nama_kelas: "X-LPB-1" },
  { id: 11, nama_kelas: "X-LPB-2" },
  { id: 12, nama_kelas: "XI-RPL-1" },
  { id: 13, nama_kelas: "XI-RPL-2" },
  { id: 14, nama_kelas: "XI-RPL-3" },
  { id: 15, nama_kelas: "XI-TKJ-1" },
  { id: 16, nama_kelas: "XI-TKJ-2" },
  { id: 17, nama_kelas: "XI-MM-1" },
  { id: 18, nama_kelas: "XI-MM-2" },
  { id: 19, nama_kelas: "XI-MM-3" },
  { id: 20, nama_kelas: "XI-MM-4" },
  { id: 21, nama_kelas: "XI-PKM-1" },
  { id: 22, nama_kelas: "XI-PKM-2" },
  { id: 23, nama_kelas: "XII-RPL-1" },
  { id: 24, nama_kelas: "XII-RPL-2" },
  { id: 25, nama_kelas: "XII-RPL-3" },
  { id: 26, nama_kelas: "XII-TKJ-1" },
  { id: 27, nama_kelas: "XII-TKJ-2" },
  { id: 28, nama_kelas: "XII-MM-1" },
  { id: 29, nama_kelas: "XII-MM-2" },
  { id: 30, nama_kelas: "XII-MM-3" },
  { id: 31, nama_kelas: "XII-MM-4" },
  { id: 32, nama_kelas: "XII-PKM-1" },
  { id: 33, nama_kelas: "XII-PKM-2" }
];

const KelasModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelectKelas: (kelas: string) => void; }> = ({ isOpen, onClose, onSelectKelas }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredKelas, setFilteredKelas] = useState<Kelas[]>(kelasList);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredKelas(kelasList.filter(kelas => kelas.nama_kelas.toLowerCase().includes(query)));
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 ${isOpen ? 'block' : 'hidden'} flex justify-center items-center`}>
      <div className="bg-[#2C3646] rounded-xl p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-300">
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-2xl text-white font-semibold text-center mb-4">Pilih Kelas</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari kelas..."
          className="w-full py-2 px-4 bg-[#3B4856] text-white rounded-lg focus:outline-none mb-4"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredKelas.length > 0 ? (
            filteredKelas.map((kelas) => (
              <button
                key={kelas.id}
                onClick={() => { onSelectKelas(kelas.nama_kelas); onClose(); }}
                className="w-full text-left px-4 py-2 bg-[#3B4856] text-white rounded-lg mb-2 hover:bg-[#4A5A6A] transition duration-200"
              >
                {kelas.nama_kelas}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-center">Kelas tidak ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KelasModal