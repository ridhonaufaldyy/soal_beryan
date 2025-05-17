import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_SOAL = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/soal?limit=0';
const API_REKAP = 'https://api.steinhq.com/v1/storages/68271dfec0883333659c3c96/rekap?limit=0';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const name = localStorage.getItem('quiz_name');
  const navigate = useNavigate();
  const [essay, setEssay] = useState({}); 

useEffect(() => {
  if (!name) {
    navigate('/');
  } else if (localStorage.getItem('quiz_submitted') === 'true') {
    navigate('/success');
  }
}, [name, navigate]);


  useEffect(() => {
    fetch(API_SOAL)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
    setHasAnswered(true);
  };

  const countCorrect = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.jawaban_benar?.trim().toLowerCase()) {
        correct++;
      }
    });
    return correct-2;
  };

  const submitToDB = async () => {
    const correct = countCorrect();
const result = {
  nama: name,
  benar: correct.toString(),
  total: questions.length.toString()-1,
  tanggal: new Date().toLocaleString(),
  essai_19: essay[19] || '',
  essai_20: essay[20] || ''
};

    try {
await fetch(API_REKAP, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([result])
});
      localStorage.setItem('quiz_submitted', 'true');
      navigate('/success');
    } catch (err) {
      console.error('Gagal kirim rekap:', err);
    }
  };

  const handleSubmit = () => {
    if (!name) return;
    submitToDB();
  };

  // Auto submit saat keluar halaman
  useEffect(() => {
    const handleUnload = () => {
      if (hasAnswered && name) submitToDB();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasAnswered && name) {
        submitToDB();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasAnswered, answers, name]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Kuis Sejarah Indonesia</h1>

      {questions.map((q, i) => (
  <div key={i} className="mb-8 p-6 …">
    <h3 className="text-lg font-semibold mb-4">{q.id}. {q.pertanyaan}</h3>

    {/* tampilkan opsi atau textarea tergantung tipe */}
    {q.tipe === 'essay' ? (
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={essay[q.id] || ''}
        onChange={e => setEssay({ ...essay, [q.id]: e.target.value })}
      />
    ) : (
      ['a','b','c','d','e'].map(opt => (
        q[`opsi_${opt}`] &&
        <label key={opt} className="block mb-2">
          <input
            type="radio"
            name={`q${i}`}
            value={opt}
            onChange={() => handleChange(i, opt)}
            className="mr-2"
          />
          {q[`opsi_${opt}`]}
        </label>
      ))
    )}
  </div>
))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Kirim Jawaban
        </button>
      </div>
    </div>
  );
}

export default Quiz;
