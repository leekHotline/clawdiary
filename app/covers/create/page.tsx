"use client";

import { Suspense } from "react";
import CreateCoverContent from "./CreateCoverContent";

export default function CreateCoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    }>
      <CreateCoverContent />
    </Suspense>
  );
}