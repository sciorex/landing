import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Blog from '../components/Blog';
import Download from '../components/Download';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Blog />
      <Download />
      <FAQ />
      <CTA />
    </>
  );
}
