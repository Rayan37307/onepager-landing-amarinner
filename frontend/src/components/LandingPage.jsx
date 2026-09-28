import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import Hero from './Hero';
import ProductShowcase from './ProductShowcase';
import Features from './Features';
import WhatsApp from './WhatsApp';
import Faq from './Faq';
import Marquee from './Marquee';
import OrderForm from './OrderForm';
import Footer from './Footer';
import StickyBar from './StickyBar';
import PageProvider from './PageProvider';
import { captureAttribution } from '../lib/attribution';
import { initPixel, trackViewContent } from '../lib/pixel';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The shared single-product landing page. Each route in App.jsx renders this
// with its own product + content config (see pages/GuddiBra.jsx, pages/Bra2.jsx).
export default function LandingPage({ product, content }) {
  const scope = useRef(null);

  useEffect(() => {
    captureAttribution();
    initPixel();
    trackViewContent(product);
  }, [product]);

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
    <PageProvider product={product} content={content}>
    <div
      ref={scope}
      className="mx-auto min-h-screen max-w-page bg-cream pb-16 shadow-sm lg:max-w-none lg:shadow-none"
    >
      <Header />
      <Hero />
      <ProductShowcase />
      <Features />
      <WhatsApp />
      <Marquee />
      <OrderForm />
      <Faq />
      <Footer />
      <StickyBar />
    </div>
    </PageProvider>
  );
}
