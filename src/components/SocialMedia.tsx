import React from 'react';
import { WavyBackground } from "@/components/ui/wavy-background";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import socials from '@/data/social_media.json'; 

function SocialMedia() {
  return (
    <div className='relative h-[40rem] overflow-hidden flex items-center justify-center'>
      <WavyBackground className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">Thank You</h2>
        <p className='text-base ms:text-lg text-white text-center mb-4'>Connect with me on these social media platforms</p>
        <div className='flex flex-row items-center justify-center mb-10 w-full'>
          <AnimatedTooltip items={socials.socials} />
        </div>
      </WavyBackground>
    </div>
  );
}

export default SocialMedia;
