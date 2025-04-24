import { useState } from "react";
import { PixelButton, Notification } from "./GameUI";
import { CheckCircle, XCircle, Cog, ArrowLeft, ArrowRight } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | null;

export default function GameButtonShowcase() {
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
    } | null>(null);

    const showNotification = (type: NotificationType, message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#111827] p-8">
            <h1 className="mb-8 font-pixel text-3xl text-white">
                Game UI Components
            </h1>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="mb-12 w-full max-w-3xl">
                <h2 className="mb-4 font-pixel text-xl text-white">
                    Button Variants
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Primary button clicked!"
                                )
                            }
                        >
                            PRIMARY
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Primary
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="secondary"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Secondary button clicked!"
                                )
                            }
                        >
                            SECONDARY
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Secondary
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="success"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Success button clicked!"
                                )
                            }
                        >
                            SUCCESS
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Success
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="warning"
                            onClick={() =>
                                showNotification(
                                    "warning",
                                    "Warning button clicked!"
                                )
                            }
                        >
                            WARNING
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Warning
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="danger"
                            onClick={() =>
                                showNotification(
                                    "error",
                                    "Danger button clicked!"
                                )
                            }
                        >
                            DANGER
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Danger
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-12 w-full max-w-3xl">
                <h2 className="mb-4 font-pixel text-xl text-white">
                    Button Sizes
                </h2>
                <div className="flex flex-wrap items-end justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            size="sm"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Small button clicked!"
                                )
                            }
                        >
                            SMALL
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Small
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            size="md"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Medium button clicked!"
                                )
                            }
                        >
                            MEDIUM
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Medium
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            size="lg"
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Large button clicked!"
                                )
                            }
                        >
                            LARGE
                        </PixelButton>
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Large
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-12 w-full max-w-3xl">
                <h2 className="mb-4 font-pixel text-xl text-white">
                    Icon Buttons
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            icon={<ArrowLeft className="h-5 w-5" />}
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Back button clicked!"
                                )
                            }
                        />
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Back
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="primary"
                            icon={<ArrowRight className="h-5 w-5" />}
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Forward button clicked!"
                                )
                            }
                        />
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Forward
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="success"
                            icon={<CheckCircle className="h-5 w-5" />}
                            onClick={() =>
                                showNotification(
                                    "success",
                                    "Confirm button clicked!"
                                )
                            }
                        />
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Confirm
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="danger"
                            icon={<XCircle className="h-5 w-5" />}
                            onClick={() =>
                                showNotification(
                                    "error",
                                    "Cancel button clicked!"
                                )
                            }
                        />
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Cancel
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <PixelButton
                            variant="secondary"
                            icon={<Cog className="h-5 w-5" />}
                            onClick={() =>
                                showNotification(
                                    "warning",
                                    "Settings button clicked!"
                                )
                            }
                        />
                        <span className="font-pixel text-xs text-[#9CA3AF]">
                            Settings
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl">
                <h2 className="mb-4 font-pixel text-xl text-white">
                    Notifications
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <PixelButton
                        variant="success"
                        onClick={() =>
                            showNotification(
                                "success",
                                "This is a success notification!"
                            )
                        }
                    >
                        SHOW SUCCESS
                    </PixelButton>
                    <PixelButton
                        variant="warning"
                        onClick={() =>
                            showNotification(
                                "warning",
                                "This is a warning notification!"
                            )
                        }
                    >
                        SHOW WARNING
                    </PixelButton>
                    <PixelButton
                        variant="danger"
                        onClick={() =>
                            showNotification(
                                "error",
                                "This is an error notification!"
                            )
                        }
                    >
                        SHOW ERROR
                    </PixelButton>
                </div>
            </div>
        </div>
    );
}
