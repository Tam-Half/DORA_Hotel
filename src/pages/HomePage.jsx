import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/homepage/HeroSection';
import FeaturedRooms from '../components/homepage/FeaturedRooms';
import PromoSection from '../components/homepage/PromoSection';
import HomeFooter from '../components/homepage/HomeFooter';

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900">
      <Header />
      <HeroSection />
      <FeaturedRooms />
      <PromoSection />
      <HomeFooter />
    </div>
  );
}