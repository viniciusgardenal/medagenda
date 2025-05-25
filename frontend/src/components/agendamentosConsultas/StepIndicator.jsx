import PropTypes from "prop-types";

const StepIndicator = ({ steps, currentStep }) => (
  <nav aria-label="Progress" className="flex justify-between mb-6">
    {steps.map((step, index) => {
      const isActive = currentStep >= index + 1;
      return (
        <div
          key={step.title}
          className="flex-1 text-center"
          role="listitem"
          aria-current={isActive ? "step" : undefined}
        >
          <div
            className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isActive ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {step.title}
          </p>
        </div>
      );
    })}
  </nav>
);

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default StepIndicator;
