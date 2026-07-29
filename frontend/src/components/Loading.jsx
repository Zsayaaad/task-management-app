const Loading = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-3">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="font-body text-sm text-text-muted animate-pulse">
        Loading TaskFlow...
      </p>
    </div>
  );
};

export default Loading;
