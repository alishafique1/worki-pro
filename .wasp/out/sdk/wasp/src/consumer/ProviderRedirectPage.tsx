import { useParams, Navigate } from 'react-router'
import { useQuery, getProviderSlugById } from 'wasp/client/operations'

export default function ProviderRedirectPage() {
  const { providerId } = useParams<{ providerId: string }>()
  const { data, isLoading } = useQuery(getProviderSlugById, { id: providerId ?? '' })
  if (isLoading) return <div className="p-8 text-sm text-[#475569]">Redirecting…</div>
  if (data?.slug) return <Navigate to={`/pro-public/${data.slug}`} replace />
  return <Navigate to="/discover" replace />
}
