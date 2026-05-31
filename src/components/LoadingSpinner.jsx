const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full w-12 h-12 border-t-4 border-emerald-600"></div>
    </div>
  );
};

export default LoadingSpinner;