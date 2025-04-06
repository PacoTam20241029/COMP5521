import './App.css';
import Header from './Components/header';
import Footer from './Components/Footer1';
import Card1 from './Components/Card1'
import Homepages from './Components/Homepages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="home">
      <Header />
      <Routes>
        <Route path="/card" element={<Card1 />} />
        <Route path="/" element={<Homepages />} />
      </Routes>

      <Footer />
    </div>
    </Router>
  );
}

export default App;