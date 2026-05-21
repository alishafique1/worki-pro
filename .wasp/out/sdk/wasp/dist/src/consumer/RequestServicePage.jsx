import React from 'react';
import { Navigate, useSearchParams } from 'react-router';
// Legacy flow — redirect to the new guest wizard, preserving query params
export default function RequestServicePage() {
    const [searchParams] = useSearchParams();
    const params = searchParams.toString();
    return <Navigate to={`/get-quotes${params ? `?${params}` : ''}`} replace/>;
}
//# sourceMappingURL=RequestServicePage.jsx.map