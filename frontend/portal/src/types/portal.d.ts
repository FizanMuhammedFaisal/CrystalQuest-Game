declare module 'game/GameUI.tsx' {
  export interface PixelButtonProps {
    children?: React.ReactNode
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    icon?: React.ReactNode
    key?: string | number
    onClick?: () => void
    disabled?: boolean
    className?: string
  }

  export function PixelButton(props: PixelButtonProps): JSX.Element
}

declare module 'authStore/AuthStore' {
  export const useAuthStore: any
  export const getAccessToken: any
  export const setAccessToken: any
  export const getUser: any
  export const setUser: any
  export const clearAuth: any
  export const isAuthenticated: any
}
