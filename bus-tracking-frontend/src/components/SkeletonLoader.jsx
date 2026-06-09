import React from "react";

export function SkeletonRouteCard() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-12 bg-gray-100 rounded-xl"></div>
        <div className="h-12 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonRouteDetails() {
  return (
    <div className="p-5 rounded-2xl bg-gray-50 animate-pulse space-y-4">
      <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div>
      <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
      <div className="space-y-2 mt-4">
        <div className="h-10 bg-white rounded-lg shadow-sm"></div>
        <div className="h-10 bg-white rounded-lg shadow-sm"></div>
        <div className="h-10 bg-white rounded-lg shadow-sm"></div>
      </div>
    </div>
  );
}
