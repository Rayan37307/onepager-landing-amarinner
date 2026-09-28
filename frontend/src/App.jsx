import { BrowserRouter, Route, Routes } from 'react-router';
import GuddiBra from './pages/GuddiBra';
import Bra2 from './pages/Bra2';
import Bra3 from './pages/Bra3';
import Blank from './pages/Blank';

// Every product gets its own path here; `/` stays empty until there's a real
// homepage to put on it.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/guddi-bra" element={<GuddiBra />} />
        <Route path="/bra2" element={<Bra2 />} />
        <Route path="/bra3" element={<Bra3 />} />
        <Route path="/" element={<Blank />} />
        <Route path="*" element={<Blank />} />
      </Routes>
    </BrowserRouter>
  );
}
