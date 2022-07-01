import Sidebar from "@component/Sidebar";
import { RouteAuthProtect } from "../layout/RouteGuard";

export default function Chat() {
  return (
    <RouteAuthProtect>
      <Sidebar />
    </RouteAuthProtect>
  );
}
