import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import ProfileInfoCard from "../components/profile/ProfileInfoCard.jsx";
import DangerZoneCard from "../components/profile/DangerZoneCard.jsx";
import { useAuthStore } from "../stores/auth.store.js";
import { LAYOUT } from "../constants/design.js";

const Profile = () => {
    const user = useAuthStore(state => state.user);
    const provider = useAuthStore(state => state.oAuthProvider);

    if (!user) return null;

    return (
        <PageContainer>
            <div className={`w-full ${LAYOUT.maxWidth}`}>
                <SectionHeading description="Manage your account information.">Profile</SectionHeading>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                    <ProfileInfoCard user={user} provider={provider} />
                    <DangerZoneCard />
                </div>
            </div>
        </PageContainer>
    );
};

export default Profile;
