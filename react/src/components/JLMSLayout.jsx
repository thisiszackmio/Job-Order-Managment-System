import { Outlet } from "react-router-dom";

export default function JLMSLayout() {
  return (
    <div className="w-full h-full font-roboto">
      {/* Main Content */}
      <div className="transition-width duration-300">
        {/* Content */}
        <div style={{ minHeight: '100vh'}} className="w-full h-full content-here">
          <Outlet />
        </div>
      </div>
    </div>
  );
}