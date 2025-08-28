import { TrafficCone } from "lucide-react";

export default function RoadSafetyLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <TrafficCone className="h-12 w-12 text-orange-500 animate-bounce" />
      <p className="text-sm text-gray-600">Loading safety equipment...</p>
    </div>
  );
}
