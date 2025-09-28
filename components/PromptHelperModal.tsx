
import React, { useState } from 'react';
import { PromptHelperLanguage } from '../types';
import { PROMPT_HELPER_CONTENT, KEYWORD_CATEGORIES, NEGATIVE_KEYWORDS } from '../constants';
import * as geminiService from '../services/geminiService';
import { CloseIcon, SpinnerIcon } from './icons/Icons';

interface PromptHelperModalProps {
  onClose: () => void;
  onInsertText: (text: string) => void;
}

type Tab = 'guide' | 'editing' | 'builder' | 'styles' | 'negative';

export const PromptHelperModal: React.FC<PromptHelperModalProps> = ({ onClose, onInsertText }) => {
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const [language, setLanguage] = useState<PromptHelperLanguage>('EN');
  const [builderState, setBuilderState] = useState({ type: '', subject: '', style: '', details: '' });
  const [isBuilding, setIsBuilding] = useState(false);

  const content = PROMPT_HELPER_CONTENT[language];

  const handleBuildPrompt = async () => {
    setIsBuilding(true);
    try {
      const generatedPrompt = await geminiService.buildPrompt(
        builderState.type,
        builderState.subject,
        builderState.style,
        builderState.details
      );
      onInsertText(generatedPrompt);
      onClose();
    } catch (error) {
      console.error("Failed to build prompt:", error);
    } finally {
      setIsBuilding(false);
    }
  };

  const KeywordButton: React.FC<{ keyword: string, translation: string }> = ({ keyword, translation }) => (
    <button onClick={() => onInsertText(keyword)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-sm text-left transition-colors">
      {translation}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-850 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Prompt Helper</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm bg-slate-800 rounded-md p-0.5">
              <button onClick={() => setLanguage('EN')} className={`px-2 py-0.5 rounded ${language === 'EN' ? 'bg-slate-600' : ''}`}>EN</button>
              <button onClick={() => setLanguage('PT-BR')} className={`px-2 py-0.5 rounded ${language === 'PT-BR' ? 'bg-slate-600' : ''}`}>PT-BR</button>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700"><CloseIcon /></button>
          </div>
        </div>
        
        <div className="flex border-b border-slate-700 px-4 text-sm">
          {(Object.keys(content.tabs) as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-3 font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              {content.tabs[tab]}
            </button>
          ))}
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4 text-slate-300">
          {activeTab === 'guide' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{content.guideContent.title}</h3>
              <p className="mb-4">{content.guideContent.p1}</p>
              <div className="bg-slate-900 p-3 rounded-md mb-3">
                <p className="font-semibold text-sm">{content.guideContent.example1_title}</p>
                <p className="text-sm text-slate-400">{content.guideContent.example1_prompt}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-md">
                <p className="font-semibold text-sm">{content.guideContent.example2_title}</p>
                <p className="text-sm text-slate-400">{content.guideContent.example2_prompt}</p>
              </div>
            </div>
          )}
          {activeTab === 'editing' && (
             <div>
              <h3 className="text-lg font-semibold mb-2">{content.editingContent.title}</h3>
              <p className="mb-4">{content.editingContent.p1}</p>
              <div className="bg-slate-900 p-3 rounded-md mb-3">
                <p className="font-semibold text-sm">{content.editingContent.template1_title}</p>
                <p className="text-sm text-slate-400">{content.editingContent.template1_prompt}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-md mb-3">
                <p className="font-semibold text-sm">{content.editingContent.template2_title}</p>
                <p className="text-sm text-slate-400">{content.editingContent.template2_prompt}</p>
              </div>
               <div className="bg-slate-900 p-3 rounded-md">
                <p className="font-semibold text-sm">{content.editingContent.template3_title}</p>
                <p className="text-sm text-slate-400">{content.editingContent.template3_prompt}</p>
              </div>
            </div>
          )}
          {activeTab === 'builder' && (
             <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">{content.builderContent.title}</h3>
              <p>{content.builderContent.p1}</p>
              <input type="text" placeholder={content.builderContent.type} value={builderState.type} onChange={e => setBuilderState({...builderState, type: e.target.value})} className="w-full bg-slate-800 p-2 rounded-md border border-slate-700"/>
              <input type="text" placeholder={content.builderContent.subject} value={builderState.subject} onChange={e => setBuilderState({...builderState, subject: e.target.value})} className="w-full bg-slate-800 p-2 rounded-md border border-slate-700"/>
              <input type="text" placeholder={content.builderContent.style} value={builderState.style} onChange={e => setBuilderState({...builderState, style: e.target.value})} className="w-full bg-slate-800 p-2 rounded-md border border-slate-700"/>
              <input type="text" placeholder={content.builderContent.details} value={builderState.details} onChange={e => setBuilderState({...builderState, details: e.target.value})} className="w-full bg-slate-800 p-2 rounded-md border border-slate-700"/>
              <button onClick={handleBuildPrompt} disabled={isBuilding} className="w-full flex justify-center items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600">
                {isBuilding ? <SpinnerIcon /> : content.builderContent.button}
              </button>
            </div>
          )}
          {activeTab === 'styles' && (
             <div className="space-y-4">
                {(Object.keys(content.keywords) as (keyof typeof KEYWORD_CATEGORIES)[]).map(cat => (
                    <div key={cat}>
                        <h4 className="font-semibold mb-2">{content.keywords[cat]}</h4>
                        <div className="flex flex-wrap gap-2">
                           {KEYWORD_CATEGORIES[cat].map(kw => <KeywordButton key={kw} keyword={kw} translation={kw} />)}
                        </div>
                    </div>
                ))}
             </div>
          )}
          {activeTab === 'negative' && (
             <div>
                <h3 className="text-lg font-semibold mb-2">{content.negativePrompts.title}</h3>
                <p className="mb-2">{content.negativePrompts.p1}</p>
                <p className="mb-3">{content.negativePrompts.p2}</p>
                <div className="flex flex-wrap gap-2">
                    {NEGATIVE_KEYWORDS.map(kw => <KeywordButton key={kw} keyword={kw} translation={kw} />)}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
