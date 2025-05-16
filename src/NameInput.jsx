import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_REKAP = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/rekap';

function NameInput() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!name.trim()) return alert('Masukkan nama terlebih dahulu');

    try {
      const res = await fetch(API_REKAP);
      const data = await res.json();

      const isExist = data.some(
        (entry) => entry.nama?.toLowerCase() === name.trim().toLowerCase()
      );

      if (isExist) {
        alert('Nama ini sudah pernah submit!');
        navigate('/success');
      } else {
        localStorage.setItem('quiz_name', name.trim());
        localStorage.setItem('quiz_submitted', 'false');
        navigate('/quiz');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal cek nama. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-4">Masukkan Nama Anda</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded w-full max-w-md mb-4"
        placeholder="Nama lengkap"
      />
      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Mulai Kuis
      </button>
    </div>
  );
}

export default NameInput;
