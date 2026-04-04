import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudy, getAllSlugs } from '@/content/case-studies'
import CaseStudyView from '@/components/case-study/CaseStudyView'

function isRasterImageAsset(path: string): boolean {
  return /\.(png|jpe?g|gif|webp)$/i.test(path)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    return { title: 'Case Study' }
  }

  const description = caseStudy.tagline
  const previewImage =
    caseStudy.heroAsset && isRasterImageAsset(caseStudy.heroAsset)
      ? caseStudy.heroAsset
      : '/og-image.png'

  return {
    title: caseStudy.name,
    description,
    openGraph: {
      title: `${caseStudy.name} | Joe Siconolfi`,
      description,
      url: `https://joesiconolfi.com/work/${slug}`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: caseStudy.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.name} | Joe Siconolfi`,
      description,
      images: [previewImage],
    },
  }
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)
  if (!caseStudy) notFound()
  return <CaseStudyView caseStudy={caseStudy} />
}
