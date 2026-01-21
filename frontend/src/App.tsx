import { Header } from './components/Header';
import { ScriptInput } from './components/ScriptInput';
import { WorkflowGuide } from './components/WorkflowGuide';
import { useBrollGenerator } from './hooks/useBrollGenerator';

function App() {
  const { script, setScript, isGenerating, handleGenerate } = useBrollGenerator();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <Header />
        <ScriptInput 
          script={script} 
          setScript={setScript} 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating} 
        />
        <WorkflowGuide />
      </div>
    </div>
  );
}

export default App;
