import type { Metadata } from 'next';
import ArtworkClient from './ArtworkClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ artName: string }>;
}): Promise<Metadata> {
  const { artName } = await params;
  const decodedArtName = decodeURIComponent(artName);

  return {
    title: `${decodedArtName} - Sanat Galerisi`,
    description: `${decodedArtName} adlı sanat eserini keşfedin. Sanat eserleri galerimizde en güzel koleksiyonlar.`,
    openGraph: {
      title: `${decodedArtName} - Sanat Galerisi`,
      description: `${decodedArtName} adlı sanat eserini keşfedin`,
      images: [`/artworks/${encodeURIComponent(decodedArtName)}.jpg`],
    },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ artName: string }> }) {
  const { artName } = await params;
  const decodedArtName = decodeURIComponent(artName);

  return <ArtworkClient artName={decodedArtName} />;
}
