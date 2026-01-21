import { useState } from 'react';

export const useBrollGenerator = () => {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!script.trim()) return;

    setIsGenerating(true);
    console.log('Generating B-roll for script:', script);

    setTimeout(() => {
      setIsGenerating(false);
      alert('B-roll generation started for: ' + script.substring(0, 30) + '...');
    }, 2000);
  };

  return {
    script,
    setScript,
    isGenerating,
    handleGenerate,
  };
};
