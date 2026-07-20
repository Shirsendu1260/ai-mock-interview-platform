import { motion } from "motion/react";
import type { ProfileInfoRowProps } from "../../types/types.js";

const ProfileInfoRow = ({ icon, label, value }: ProfileInfoRowProps) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 }
            }}
            className="flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-3 text-accent">{icon}</div>
                <span className="text-muted">{label}</span>
            </div>

            <span className="font-medium text-dark">{value}</span>
        </motion.div>
    );
};

export default ProfileInfoRow;
