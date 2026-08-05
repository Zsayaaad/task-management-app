import { useNavigation } from "react-router-dom";

const SubmitBtn = ({ text, className, submittingText, icon }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const defaultClasses =
    "w-full mt-2 py-3 px-4 rounded-lg bg-primary hover:opacity-90 font-button text-on-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5";
  const combinedClassName = className ? className : defaultClasses;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return <span className="material-symbols-outlined text-base">{icon}</span>;
    }
    return icon;
  };

  return (
    <button type="submit" disabled={isSubmitting} className={combinedClassName}>
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-on-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {submittingText || "Submitting..."}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          {renderIcon()}
          <span>{text || "Submit"}</span>
        </span>
      )}
    </button>
  );
};

export default SubmitBtn;
