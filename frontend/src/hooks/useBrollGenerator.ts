import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

export type BrollStyle = 'transparent_skeleton' | '2d_animation' | '';

const STORAGE_KEYS = {
  script: 'broll_script',
  formattedScript: 'broll_formatted_script',
  showFormattedOutput: 'broll_show_formatted_output',
};

export const useBrollGenerator = () => {
  // Load from localStorage on mount
  const [script, setScriptState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.script) || '';
    }
    return '';
  });
  
  const [formattedScript, setFormattedScriptState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.formattedScript) || '';
    }
    return '';
  });
  
  const [isFormatting, setIsFormatting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFormattedOutput, setShowFormattedOutputState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.showFormattedOutput) === 'true';
    }
    return false;
  });
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<BrollStyle>('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [pendingFormat, setPendingFormat] = useState(false);

  // Save to localStorage whenever script changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (script) {
        localStorage.setItem(STORAGE_KEYS.script, script);
      } else {
        localStorage.removeItem(STORAGE_KEYS.script);
      }
    }
  }, [script]);

  // Save formattedScript to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (formattedScript) {
        localStorage.setItem(STORAGE_KEYS.formattedScript, formattedScript);
      } else {
        localStorage.removeItem(STORAGE_KEYS.formattedScript);
      }
    }
  }, [formattedScript]);

  // Save showFormattedOutput to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.showFormattedOutput, showFormattedOutput.toString());
    }
  }, [showFormattedOutput]);

  // Wrapper functions to update state
  const setScript = (value: string) => {
    setScriptState(value);
  };

  const setFormattedScript = (value: string) => {
    setFormattedScriptState(value);
  };

  const setShowFormattedOutput = (value: boolean) => {
    setShowFormattedOutputState(value);
  };

  const performFormat = async () => {
    if (!script.trim()) return;
    
    setIsFormatting(true);
    setError(null);
    
    // Clear old output before formatting new one
    setShowFormattedOutput(false);
    setFormattedScript('');
    
    try {
      const formatted = await apiService.formatScript(script);
      setFormattedScript(formatted);
      setShowFormattedOutput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format script');
      console.error('Format error:', err);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleFormat = async () => {
    if (!script.trim()) return;
    
    // If there's already formatted output, show confirmation dialog
    if (showFormattedOutput && formattedScript.trim()) {
      setShowConfirmDialog(true);
      setPendingFormat(true);
      return;
    }
    
    // Otherwise, format directly
    await performFormat();
  };

  const confirmFormat = async () => {
    setShowConfirmDialog(false);
    setPendingFormat(false);
    await performFormat();
  };

  const cancelFormat = () => {
    setShowConfirmDialog(false);
    setPendingFormat(false);
  };

  const handleGenerateClick = () => {
    if (!script.trim()) return;
    setShowStyleOptions(true);
  };

  const handleGenerateBroll = async () => {
    if (!selectedStyle) return;

    setIsGenerating(true);
    console.log(`Generating ${selectedStyle} B-roll for script:`, script);

    // TODO: Will call backend for B-roll generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`B-roll generation (${selectedStyle}) started!`);
    }, 2000);
  };

  const onScriptChange = (value: string) => {
    setScript(value);
    setError(null);
  };

  // Show clear confirmation dialog
  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  // Clear all data function (called after confirmation)
  const confirmClear = () => {
    setScript('');
    setFormattedScript('');
    setShowFormattedOutput(false);
    setShowStyleOptions(false);
    setSelectedStyle('');
    setError(null);
    setShowConfirmDialog(false);
    setShowClearDialog(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.script);
      localStorage.removeItem(STORAGE_KEYS.formattedScript);
      localStorage.removeItem(STORAGE_KEYS.showFormattedOutput);
    }
  };

  // Cancel clear action
  const cancelClear = () => {
    setShowClearDialog(false);
  };

  return {
    script,
    setScript: onScriptChange,
    formattedScript,
    isFormatting,
    isGenerating,
    showFormattedOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    error,
    handleFormat,
    handleGenerateClick,
    handleGenerateBroll,
    showConfirmDialog,
    confirmFormat,
    cancelFormat,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
  };
};
