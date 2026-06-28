import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { TbTrashXFilled } from "react-icons/tb";

const DangerZoneCard = () => {
    return (
        <Card>
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>

            <p className="mt-3 text-muted">
                Permanently delete your account and all interview history.
                This action cannot be undone.
            </p>

            <Button variant="secondary" className="mt-8 w-full" >
                <TbTrashXFilled/>
                Delete Account
            </Button>
        </Card>
    );
};

export default DangerZoneCard;
