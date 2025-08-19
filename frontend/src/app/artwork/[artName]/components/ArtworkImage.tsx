'use client';

import React from 'react';
import { getImageUrl } from '../utils/imageUtils';

interface ArtworkImageProps {
  artwork: {
    art_name: string;
    image_url: string;
  };
}

export default function ArtworkImage({ artwork }: ArtworkImageProps) {
  const imageSrc = getImageUrl(artwork.art_name, artwork.image_url);

  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-lg max-w-2xl mx-auto">
        <img
          src={imageSrc}
          alt={artwork.art_name}
          className="w-full h-auto object-cover shadow-lg"
        />
      </div>
    </div>
  );
}
