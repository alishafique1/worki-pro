// Signup and login share the same OTP flow — users land on /login
// This page redirects to /login for consistency
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { routes } from 'wasp/client/router'

export function Signup() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(routes.LoginRoute.to, { replace: true })
  }, [navigate])
  return null
}
