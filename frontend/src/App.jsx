import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Features from './components/Features';
import Countdown from './components/Countdown';
import ProductVideo from './components/ProductVideo';
import WhatsApp from './components/WhatsApp';
import Faq from './components/Faq';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import StickyBar from './components/StickyBar';
import { captureAttribution } from './lib/attribution';
import { initPixel, trackViewContent } from './lib/pixel';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const scope = useRef(null);

  useEffect(() => {
    captureAttribution();
    initPixel();
    trackViewContent();
  }, []);

  // Quiet scroll choreography: anything tagged `data-reveal` fades up gently as
  // it enters. Nothing is hidden in CSS, so reduced-motion (and no-JS) visitors
  // just see the finished page.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
        ScrollTrigger.refresh();
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="mx-auto min-h-screen max-w-page bg-cream pb-16 shadow-sm">
      <Header />
      <Hero />
      <ProductShowcase />
      <Features />
      <Countdown />
      <ProductVideo />
      <WhatsApp />
      <OrderForm />
      <Faq />
      <Footer />
      <StickyBar />
    </div>
  );
}
