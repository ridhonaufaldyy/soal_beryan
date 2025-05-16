import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameInput from './NameInput';
import Quiz from './quiz';
import Success from './Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NameInput />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
