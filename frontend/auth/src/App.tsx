import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import J from './components/J'
import { ForgotPasswordForm } from './components/ForgotPassword'
import { AuthWrapper } from './wrapper/AuthWrapper'
import { useAuthInitialization } from './hooks/useAuthInitialization'
import { ProtectedWrapper } from './wrapper/ProtectedWrapper'

const routes = [
  {
    path: '/login',
    element: (
      <AuthWrapper>
        <LoginForm />
      </AuthWrapper>
    )
  },
  {
    path: '/signup',
    element: (
      <AuthWrapper>
        <SignupForm />
      </AuthWrapper>
    )
  },
  {
    path: '/j',
    element: (
      <ProtectedWrapper>
        {' '}
        <J />
      </ProtectedWrapper>
    )
  },
  {
    path: '/forgot',
    element: (
      <AuthWrapper>
        <ForgotPasswordForm />
      </AuthWrapper>
    )
  }
]

const router = createBrowserRouter(routes, {
  basename: '/auth'
})

function App() {
  const isAuthInitialized = useAuthInitialization()

  if (!isAuthInitialized) {
    return <div>Loading application...</div>
  }
  return <RouterProvider router={router} />
}

export default App
