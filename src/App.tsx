import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Blog from './components/Blog';
import Download from './components/Download';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <HowItWorks />
        <Pricing />
        <Blog />
        <Download />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
