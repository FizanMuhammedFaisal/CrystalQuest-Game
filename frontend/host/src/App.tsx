import {
  createBrowserRouter,
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <GameLaunchWrapper />
  },
  {
    path: '/game',
    element: <LazyComponent Component={Game} />
  },
  {
    path: 'auth/*',
    element: <Auth />
  },
  {
    path: 'dashboard',
    element: <LazyComponent Component={DashBoard} />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
