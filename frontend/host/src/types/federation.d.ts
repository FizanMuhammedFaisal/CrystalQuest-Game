declare module 'game/Game' {
  const Game: React.ComponentType
  export default Game
}

declare module 'auth/Auth' {
  const Auth: React.ComponentType
  export default Auth
}

declare module 'dashboard/Dashboard' {
  const Dashboard: React.ComponentType
  export default Dashboard
}
declare module 'portal/Portal' {
  import { NavigateFunction } from 'react-router-dom'

  interface PortalProps {
    onNavigate: NavigateFunction
  }
  const Portal: React.ComponentType<PortalProps>
  export default Portal
}
