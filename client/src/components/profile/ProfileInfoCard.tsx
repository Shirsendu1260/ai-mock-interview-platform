import { motion } from "motion/react";
import { FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { RiCopperCoinFill } from "react-icons/ri";
import Card from "../ui/Card.jsx";
import type { ProfileInfoCardProps } from "../../types/types.js";
import { formatDate } from "../../utils/helpers.js";
import UserAvatar from "../common/UserAvatar.jsx";
import { APP_NAME } from "../../constants/app.js";
import ProfileInfoRow from "./ProfileInfoRow.jsx";

const ProfileInfoCard = ({ user, provider }: ProfileInfoCardProps) => {
    return (
        <Card>
            <div className="flex flex-col items-center">
                <UserAvatar size={24}/>
                <h2 className="mt-5 text-2xl font-semibold text-dark">{user.fullName}</h2>
                <p className="text-muted">{APP_NAME} User</p>
            </div>

            <div className="my-8 border-t border-border" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.08 }
                    }
                }}
                className="space-y-6"
            >
                <ProfileInfoRow
                    icon={<FaEnvelope/>}
                    label="Email"
                    value={user.email}
                />
                <ProfileInfoRow
                    icon={<RiCopperCoinFill className='text-yellow-400' />}
                    label="Credits"
                    value={String(user.credit)}
                />
                <ProfileInfoRow
                    icon={<MdVerified />}
                    label="Current Plan"
                    value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                />
                <ProfileInfoRow
                    icon={provider === "google" ? <FcGoogle /> : <BsGithub />}
                    label="Signed in with"
                    value={ provider === "google" ? "Google" : "GitHub" }
                />
                <ProfileInfoRow
                    icon={<FaCalendarAlt />}
                    label="Member Since"
                    value={formatDate(user.createdAt)}
                />
            </motion.div>
        </Card>
    );
};

export default ProfileInfoCard;
