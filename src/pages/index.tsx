import Sidebar from "@component/Sidebar";
import RouteProtect from "../layout/RouteGuard";

export default function Chat() {
  return (
    <RouteProtect>
      <Sidebar />
    </RouteProtect>
  );
}
