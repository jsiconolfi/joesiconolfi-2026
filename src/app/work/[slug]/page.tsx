import { notFound } from 'next/navigation'
import { getCaseStudy, getAllSlugs } from '@/content/case-studies'
import CaseStudyView from '@/components/case-study/CaseStudyView'

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
