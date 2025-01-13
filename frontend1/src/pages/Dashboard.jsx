import { Appbar } from "../components/Appbar"; // Use curly braces for named import
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={"10,000"} />
                <Users />
            </div>
        </div>
    );
};
