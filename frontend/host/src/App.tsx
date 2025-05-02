import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate
} from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Game = lazy(() =>
  import('game/Game').catch(() => ({
    default: () => <div>Failed to load Game</div>
  }))
)
const DashBoard = lazy(() =>
  import('dashboard/Dashboard').catch(() => ({
    default: () => <div>Failed to load Game</div>
  }))
)
const Auth = lazy(() =>
  import('auth/Auth').catch(() => ({
    default: () => <div>Failed to load Auth</div>
  }))
)
const Navbar = lazy(() =>
  import('auth/Navbar').catch(() => ({
    default: () => <div>Failed to load Auth</div>
  }))
)
const GameLaunch = lazy(() =>
  import('portal/Portal').catch(() => ({
    default: () => <div>Failed to load Portal</div>
  }))
)

const LoadingComponent = () => <div>Loading...</div>

// Wrap components with Suspense
const LazyComponent = ({ Component }: { Component: React.ComponentType }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Component />
  </Suspense>
)

const GameLaunchWrapper = () => {
  const navigate = useNavigate()

  return (
    <Suspense fallback={<LoadingComponent />}>
      <GameLaunch onNavigate={navigate} />
    </Suspense>
  )
}
const Layout = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen'>
      <Suspense fallback={<LoadingComponent />}>
        <Navbar navigate={navigate} />
      </Suspense>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <GameLaunchWrapper />
      },

      {
        path: 'auth/*',
        element: <Auth />
      }
    ]
  },
  {
    path: 'dashboard',
    element: <LazyComponent Component={DashBoard} />
  },
  {
    path: '/game',
    element: <LazyComponent Component={Game} />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App

// projecttedremoteComponent.tsx
// export default App
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from './auth/useAuth' // your custom auth hook

// const ProtectedRemoteComponent = ({ remotePath }: { remotePath: string }) => {
//   const [Component, setComponent] = useState<React.ComponentType | null>(null)
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/auth/login')
//       return
//     }

//     // Dynamically load the remote module AFTER auth check
//     import(remotePath)
//       .then(mod => {
//         setComponent(() => mod.default)
//       })
//       .catch(err => {
//         console.error('Remote load failed:', err)
//         setComponent(() => () => <div>Failed to load remote</div>)
//       })
//   }, [isAuthenticated, navigate, remotePath])

//   if (!Component) return <div>Loading...</div>
//   return <Component />
// }
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <GameLaunchWrapper />
//   },
//   {
//     path: '/game',
//     element: <ProtectedRemoteComponent remotePath='game/Game' />
//   },
//   {
//     path: 'auth/*',
//     element: <Auth />
//   },
//   {
//     path: 'dashboard',
//     element: <ProtectedRemoteComponent remotePath='dashboard/Dashboard' />
//   }
// ])
