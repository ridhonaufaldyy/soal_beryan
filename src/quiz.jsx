import React, { useEffect, useState } from 'react';

const API_SOAL = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/soal?limit=0';
const API_REKAP = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/rekap';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');

  useEffect(() => {
    fetch(API_SOAL)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Masukkan nama terlebih dahulu!");
      return;
    }

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.jawaban_benar?.trim().toLowerCase()) {
        correct++;
      }
    });

    const result = {
      nama: name,
      benar: correct.toString(),
      total: questions.length.toString(),
      tanggal: new Date().toLocaleString()
    };

    try {
      await fetch(API_REKAP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([result])
      });
      alert(`Jawaban benar: ${correct} dari ${questions.length}\nData disimpan ke rekap!`);
    } catch (err) {
      console.error('Gagal menyimpan rekap:', err);
      alert(`Jawaban benar: ${correct} dari ${questions.length}\n(TAPI rekap gagal disimpan)`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Kuis Sejarah Indonesia</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Nama Anda:</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {questions.map((q, i) => (
        <div key={i} className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-4">{q.id}. {q.pertanyaan}</h3>

          {q.gambar_url && q.gambar_url.trim() !== '' && (
            <div className="mb-4">
              <img
                src={q.gambar_url}
                alt={`Gambar soal ${i + 1}`}
                className="max-w-full h-auto rounded"
              />
            </div>
          )}

          <div className="space-y-2">
            {['a', 'b', 'c', 'd', 'e'].map(opt => (
              q[`opsi_${opt}`] ? (
                <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    onChange={() => handleChange(i, opt)}
                    className="form-radio text-blue-600"
                  />
                  <span>{q[`opsi_${opt}`]}</span>
                </label>
              ) : null
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
        >
          Kirim Jawaban
        </button>
      </div>
    </div>
  );
}

export default Quiz;
