import GameLaunch from './GameLaunch'

// Make onNavigate optional since it will be provided by the host
interface AppProps {
  onNavigate?: (path: string) => void
}

function App({ onNavigate = () => {} }: AppProps) {
  return (
    <div>
      <GameLaunch onNavigate={onNavigate} />
    </div>
  )
}

export default App
