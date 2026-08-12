import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { StatsBento } from '../components/StatsBento';
import { HowItWorks } from '../components/HowItWorks';
import { PricingSection } from '../components/PricingSection';

export const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsBento />
      <HowItWorks />
      <PricingSection />
    </>
  );
};