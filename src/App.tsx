import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { useLocation } from 'react-router-dom';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNavPaths = ['/admin', '/login', '/signup'];
  const shouldHide = hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHide && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!shouldHide && <Footer />}
    </div>
  );
}

function App() {
  // Use environment variable for Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter basename="/portfolio">
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
