import React from "react";

const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex justify-between mb-6">
    {steps.map((step, index) => (
      <div key={index} className="flex-1 text-center">
        <div
          className={`inline-block w-8 h-8 rounded-full ${
            currentStep >= index + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          } flex items-center justify-center text-sm font-semibold`}
        >
          {index + 1}
        </div>
        <p className="mt-1 text-sm font-semibold text-gray-700">{step.title}</p>
      </div>
    ))}
  </div>
);

export default StepIndicator;