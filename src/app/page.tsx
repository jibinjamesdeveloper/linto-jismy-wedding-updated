'use client';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import OurStorySection from './components/OurStorySection';
import WeddingDetailsSection from './components/WeddingDetailsSection';
import GallerySection from './components/GallerySection';
import WishesSection from './components/WishesSection';
import FooterSection from './components/FooterSection';
import MusicPlayer from './components/MusicPlayer';

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <OurStorySection />
      <WeddingDetailsSection />
      <GallerySection />
      <WishesSection />
      <FooterSection />
      <MusicPlayer />
    </main>
  );
}
