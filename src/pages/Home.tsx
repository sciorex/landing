import Hero from '../components/Hero';
import Features from '../components/Features';
import Showcase from '../components/Showcase';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Blog from '../components/Blog';
import Download from '../components/Download';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Showcase />
      <HowItWorks />
      <Pricing />
      <Blog />
      <Download />
      <CTA />
    </>
  );
}
