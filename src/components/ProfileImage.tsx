'use client';

import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            // Cast to HTMLImageElement to access src property
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-profile.jpg';
            target.onerror = null; // Prevent infinite loop
          }}
        />
      ) : (
        <Image
          src="/placeholder-profile.jpg"
          alt="Profile Placeholder"
          fill
          className="object-cover"
        />
      )}
    </div>
  );
};

export default ProfileImage; 