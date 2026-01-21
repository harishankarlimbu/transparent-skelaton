export const WorkflowGuide = () => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-400 uppercase tracking-widest text-xs font-semibold">
            How it works
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3">
          <div className="text-indigo-600 font-bold text-xl mb-1">1</div>
          <div className="text-xs text-slate-500 font-medium">Paste Script</div>
        </div>
        <div className="p-3">
          <div className="text-indigo-600 font-bold text-xl mb-1">2</div>
          <div className="text-xs text-slate-500 font-medium">AI Analysis</div>
        </div>
        <div className="p-3">
          <div className="text-indigo-600 font-bold text-xl mb-1">3</div>
          <div className="text-xs text-slate-500 font-medium">Get Video</div>
        </div>
      </div>
    </div>
  );
};
