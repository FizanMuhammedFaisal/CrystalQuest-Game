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
