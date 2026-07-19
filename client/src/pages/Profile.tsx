import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import ProfileInfoCard from "../components/profile/ProfileInfoCard.jsx";
import DangerZoneCard from "../components/profile/DangerZoneCard.jsx";
import { useAuthStore } from "../stores/auth.store.js";
import { LAYOUT } from "../constants/design.js";

const Profile = () => {
    const user = useAuthStore(state => state.user);

    if (!user) return null;

    return (
        <PageContainer>
            <div className={`w-full mx-auto ${LAYOUT.maxWidth}`}>
                <SectionHeading description="Manage your account information.">Profile</SectionHeading>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
                    <ProfileInfoCard user={user} />
                    <DangerZoneCard />
                </div>
            </div>
        </PageContainer>
    );
};

export default Profile;
