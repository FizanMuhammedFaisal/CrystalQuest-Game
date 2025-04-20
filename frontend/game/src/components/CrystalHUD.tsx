import { useGameStore } from "../stores/gameStore";
type Props = {
    className?: string;
};
const CrystalHUD: React.FC<Props> = ({ className }) => {
    const {
        crystalsHeld,
        crystalsServed,
        maxCrystals,
        targetCrystals,
        isGameComplete,
    } = useGameStore();

    return (
        <div className={className}>
            <div>
                <div>
                    Crystals: {crystalsHeld}/{maxCrystals}
                </div>
                <div>
                    Progress: {crystalsServed}/{targetCrystals}
                    {isGameComplete && " (Complete!)"}
                </div>
            </div>
        </div>
    );
};

export default CrystalHUD;
