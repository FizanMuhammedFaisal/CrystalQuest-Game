import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    Volume2,
    VolumeX,
    Cog,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "warning";
type ButtonSize = "sm" | "md" | "lg";
type NotificationType = "success" | "error" | "warning" | null;

interface PixelButtonProps {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    onClick?: () => void;
    key?: string | number;
    disabled?: boolean;
    className?: string;
}

interface NotificationProps {
    type: NotificationType;
    message: string;
    onClose: () => void;
}

export function GameUI() {
    const [isMuted, setIsMuted] = useState(false);
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
    } | null>(null);

    const showNotification = (type: NotificationType, message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#111827] p-4">
            <div className="mb-8 text-center">
                <h1 className="mb-2 font-pixel text-4xl text-white">
                    PIXEL ADVENTURE
                </h1>
                <p className="font-pixel text-lg text-[#9CA3AF]">
                    Press START to begin your journey
                </p>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
                <PixelButton
                    variant="primary"
                    size="lg"
                    onClick={() =>
                        showNotification(
                            "success",
                            "Settings saved successfully!"
                        )
                    }
                >
                    SETTINGS
                </PixelButton>
                <PixelButton
                    variant="secondary"
                    size="lg"
                    onClick={() =>
                        showNotification(
                            "warning",
                            "Some options may affect gameplay"
                        )
                    }
                >
                    OPTIONS
                </PixelButton>
                <PixelButton
                    variant="warning"
                    size="lg"
                    onClick={() => showNotification("warning", "Game paused")}
                >
                    PAUSE
                </PixelButton>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-5">
                <PixelButton
                    variant="warning"
                    size="md"
                    onClick={() => showNotification("success", "Game started!")}
                >
                    PLAY
                </PixelButton>
                <PixelButton
                    variant="primary"
                    size="md"
                    onClick={() =>
                        showNotification("success", "Returned to menu")
                    }
                >
                    MENU
                </PixelButton>
                <PixelButton
                    variant="secondary"
                    size="md"
                    icon={<ArrowLeft className="h-5 w-5" />}
                    onClick={() => showNotification("warning", "Going back")}
                />
                <PixelButton
                    variant="success"
                    size="md"
                    icon={<CheckCircle className="h-5 w-5" />}
                    onClick={() =>
                        showNotification("success", "Action confirmed!")
                    }
                />
                <PixelButton
                    variant="danger"
                    size="md"
                    icon={<XCircle className="h-5 w-5" />}
                    onClick={() =>
                        showNotification("error", "Action cancelled")
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <PixelButton
                    variant="success"
                    size="md"
                    onClick={() => showNotification("success", "Game started!")}
                >
                    START
                </PixelButton>
                <PixelButton
                    variant="danger"
                    size="md"
                    onClick={() => showNotification("error", "Exiting game...")}
                >
                    EXIT
                </PixelButton>
                <PixelButton
                    variant="primary"
                    size="md"
                    icon={<ArrowRight className="h-5 w-5" />}
                    onClick={() =>
                        showNotification("success", "Moving forward")
                    }
                />
                <PixelButton
                    variant="secondary"
                    size="md"
                    icon={
                        isMuted ? (
                            <VolumeX className="h-5 w-5" />
                        ) : (
                            <Volume2 className="h-5 w-5" />
                        )
                    }
                    onClick={() => setIsMuted(!isMuted)}
                />
                <PixelButton
                    variant="warning"
                    size="md"
                    icon={<Cog className="h-5 w-5" />}
                    onClick={() =>
                        showNotification("warning", "Adjusting settings")
                    }
                />
            </div>
        </div>
    );
}

export function PixelButton({
    children,
    variant = "primary",
    size = "md",
    icon,
    onClick,
    key,
    disabled = false,
    className = "",
}: PixelButtonProps) {
    const variantClasses = {
        primary:
            "bg-green-500 border-t-green-300 border-l-green-300 border-r-green-700 border-b-green-700 hover:bg-green-400 active:bg-green-600",
        secondary:
            "bg-blue-500 border-t-blue-300 border-l-blue-300 border-r-blue-700 border-b-blue-700 hover:bg-blue-400 active:bg-blue-600",
        danger: "bg-red-500 border-t-red-300 border-l-red-300 border-r-red-700 border-b-red-700 hover:bg-red-400 active:bg-red-600",
        success:
            "bg-orange-500 border-t-orange-300 border-l-orange-300 border-r-orange-700 border-b-orange-700 hover:bg-orange-400 active:bg-orange-600",
        warning:
            "bg-purple-500 border-t-purple-300 border-l-purple-300 border-r-purple-700 border-b-purple-700 hover:bg-purple-400 active:bg-purple-600",
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } },
        disabled: { opacity: 0.5, scale: 1 },
    };

    return (
        <motion.button
            key={key}
            className={`font-pixel relative select-none border-4 text-center font-bold text-[#111827] transition-colors ${
                variantClasses[variant]
            } ${sizeClasses[size]} ${className} ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={onClick}
            disabled={disabled}
            initial="initial"
            whileHover={disabled ? "disabled" : "hover"}
            whileTap={disabled ? "disabled" : "tap"}
            variants={buttonVariants}
            style={{
                imageRendering: "pixelated",
                boxShadow: "0px 4px 0px rgba(0, 0, 0, 0.2)",
            }}
        >
            <div className="flex items-center justify-center gap-2">
                {icon && <span>{icon}</span>}
                {children}
            </div>
        </motion.button>
    );
}

export function Notification({ type, message, onClose }: NotificationProps) {
    const notificationVariants = {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
    };

    const getNotificationStyles = () => {
        switch (type) {
            case "success":
                return "bg-green-500 border-t-green-300 border-l-green-300 border-r-green-700 border-b-green-700";
            case "error":
                return "bg-red-400 border-t-red-200 border-l-red-200 border-r-red-700 border-b-red-700";
            case "warning":
                return "bg-yellow-500 border-t-yellow-300 border-l-yellow-300 border-r-yellow-700 border-b-yellow-700";
            default:
                return "bg-blue-500 border-t-blue-300 border-l-blue-300 border-r-blue-700 border-b-blue-700";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5" />;
            case "error":
                return <XCircle className="h-5 w-5" />;
            case "warning":
                return <AlertCircle className="h-5 w-5" />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className={`fixed top-4 z-50 mx-auto flex w-full max-w-md items-center justify-between border-4 p-4 font-pixel text-[#111827] ${getNotificationStyles()}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={notificationVariants}
        >
            <div className="flex items-center gap-2">
                {getIcon()}
                <span>{message}</span>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-[#111827] hover:text-[#374151]"
            >
                <XCircle className="h-5 w-5" />
            </button>
        </motion.div>
    );
}
