import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_REKAP = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/rekap';

function NameInput() {
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleCheckName = async () => {
    if (!name.trim()) {
      alert('Masukkan nama terlebih dahulu');
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(API_REKAP);
      const data = await res.json();
      const alreadySubmitted = data.some(item =>
        item.nama?.trim().toLowerCase() === name.trim().toLowerCase()
      );

      if (alreadySubmitted) {
        alert('Nama ini sudah mengisi kuis!');
        navigate('/success');
      } else {
        localStorage.setItem('quiz_name', name.trim());
        navigate('/quiz');
      }
    } catch (err) {
      console.error('Gagal cek nama:', err);
      alert('Terjadi kesalahan saat memeriksa nama.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Masukkan Nama untuk Mengikuti Kuis</h1>
      <input
        type="text"
        placeholder="Nama lengkap"
        value={name}
        onChange={e => setName(e.target.value)}
        className="p-3 border border-gray-300 rounded w-full max-w-md mb-4"
      />
      <button
        onClick={handleCheckName}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={checking}
      >
        {checking ? 'Memeriksa...' : 'Lanjutkan'}
      </button>
    </div>
  );
}

export default NameInput;
