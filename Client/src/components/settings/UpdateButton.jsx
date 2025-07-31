const UpdateButton = ({ onClick, isLoading, isDisabled }) => {
  return (
    <button
      type="submit"
      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
        isLoading
          ? "bg-[var(--txt-disabled)] cursor-not-allowed"
          : "bg-[var(--btn)] hover:bg-[var(--btn-hover)] hover:shadow-xl transform hover:-translate-y-0.5"
      }`}
      onClick={onClick}
      disabled={isLoading || isDisabled}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Updating...
        </div>
      ) : (
        "Update Account"
      )}
    </button>
  );
};

export default UpdateButton;
