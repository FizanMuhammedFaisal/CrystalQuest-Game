import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import J from './components/J'

const routes = [
  {
    path: '/login',
    element: <LoginForm />
  },
  {
    path: '/signup',
    element: <SignupForm />
  },
  {
    path: '/j',
    element: <J />
  }
]

const router = createBrowserRouter(routes, {
  basename: '/auth'
})

function App() {
  return <RouterProvider router={router} />
}

export default App
