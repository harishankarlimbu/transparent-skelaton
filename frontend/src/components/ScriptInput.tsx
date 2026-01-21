interface ScriptInputProps {
  script: string;
  setScript: (value: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export const ScriptInput = ({ script, setScript, onGenerate, isGenerating }: ScriptInputProps) => {
  return (
    <form onSubmit={onGenerate} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm">
        <div>
          <label htmlFor="script" className="block text-sm font-medium text-slate-700 mb-2">
            Enter your script
          </label>
          <textarea
            id="script"
            name="script"
            rows={6}
            required
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-900 resize-none"
            placeholder="Once upon a time in a city made of glass..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isGenerating || !script.trim()}
          className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white transition-all duration-200 ${
            isGenerating || !script.trim()
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Visuals...
            </span>
          ) : (
            'Generate B-Roll'
          )}
        </button>
      </div>
    </form>
  );
};
