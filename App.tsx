
import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Trash2, 
  RotateCcw, 
  ChevronRight, 
  Info, 
  Sparkles,
  Github,
  Maximize2
} from 'lucide-react';
import TreeRenderer from './components/TreeRenderer';
import { TreeProblem, TreeNode } from './types';
import { buildBST, deleteFromBST, buildAVL, buildDecisionTree } from './utils/treeUtils';
import { geminiService } from './services/geminiService';

const PROBLEMS: TreeProblem[] = [
  {
    id: 'q1',
    title: 'Problem 1: Decision Tree',
    description: 'A binary search decision tree based on the data: 11, 13, 25, 37, 44, 51, 59, 63, 67, 71, 79, 83, 101. The midpoint logic (L+H)//2 determines nodes.',
    type: 'DECISION',
    initialData: [11, 13, 25, 37, 44, 51, 59, 63, 67, 71, 79, 83, 101],
  },
  {
    id: 'q2',
    title: 'Problem 2: BST Operations',
    description: 'Initial sequence: 21, 33, 10, 5, 9, 37, 35, 29, 17, 55, 20. Explore the tree before and after deleting root 21, then 37 and 55.',
    type: 'BST',
    initialData: [21, 33, 10, 5, 9, 37, 35, 29, 17, 55, 20],
  },
  {
    id: 'q3',
    title: 'Problem 3: Final AVL Tree',
    description: 'Visualizing the final state of an AVL tree built from a decreasing sequence: 23, 21, 19, ..., 1. Shows a perfectly balanced structure.',
    type: 'AVL',
    initialData: Array.from({length: 12}, (_, i) => 23 - i * 2),
  }
];

const App: React.FC = () => {
  const [activeProblem, setActiveProblem] = useState<TreeProblem>(PROBLEMS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [question, setQuestion] = useState('');

  // Compute trees for steps
  const trees = useMemo(() => {
    if (activeProblem.id === 'q1') {
      return [{ label: 'Full Tree', root: buildDecisionTree() }];
    }
    if (activeProblem.id === 'q2') {
      const initialRoot = buildBST(activeProblem.initialData);
      const afterDeletions = buildBST(activeProblem.initialData);
      deleteFromBST(afterDeletions, 21);
      deleteFromBST(afterDeletions, 37);
      deleteFromBST(afterDeletions, 55);
      return [
        { label: 'Initial BST', root: initialRoot! },
        { label: 'After Deletions (21, 37, 55)', root: afterDeletions! }
      ];
    }
    if (activeProblem.id === 'q3') {
      return [{ label: 'Final AVL State', root: buildAVL(activeProblem.initialData)! }];
    }
    return [];
  }, [activeProblem]);

  const handleAskGemini = async () => {
    if (!question.trim()) return;
    setIsLoadingAi(true);
    setAiResponse(null);
    try {
      const resp = await geminiService.explainStructure(activeProblem.title, trees[currentStep].root, question);
      setAiResponse(resp);
    } catch (err) {
      setAiResponse("Failed to connect to AI. Please check your network.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Network size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Tree Lab</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-800 transition-colors">
            <Info size={20} />
          </button>
          <button className="text-slate-500 hover:text-slate-800 transition-colors">
            <Github size={20} />
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">v1.0.4 - Canary</span>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Laboratory Tasks</h2>
            <div className="space-y-2">
              {PROBLEMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProblem(p);
                    setCurrentStep(0);
                    setAiResponse(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeProblem.id === p.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ChevronRight size={16} className={activeProblem.id === p.id ? 'opacity-100' : 'opacity-0'} />
                  <span className="font-medium text-sm">{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-700">AI Teaching Assistant</h3>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about rotations, deletions, or balancing..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm"
              rows={3}
            />
            <button
              onClick={handleAskGemini}
              disabled={isLoadingAi}
              className="w-full mt-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoadingAi ? 'Thinking...' : 'Get AI Explanation'}
            </button>
          </div>
        </aside>

        {/* Workspace */}
        <section className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-8">
            {/* Context */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded tracking-widest">{activeProblem.type}</span>
                <h2 className="text-3xl font-bold text-slate-900">{activeProblem.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                {activeProblem.description}
              </p>
            </div>

            {/* Steps & Controls */}
            {trees.length > 1 && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
                {trees.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      currentStep === idx 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            )}

            {/* Tree Area */}
            <div className="relative group">
              <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={16} className="text-slate-400" />
              </div>
              <TreeRenderer 
                data={trees[currentStep].root} 
                width={900} 
                height={550} 
              />
            </div>

            {/* Metadata / Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <RotateCcw size={16} className="text-blue-600" /> Input Sequence
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProblem.initialData.map((val, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-md text-xs font-mono text-slate-700 border border-slate-200">
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              {aiResponse && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Sparkles size={16} /> Gemini Insight
                  </h4>
                  <div className="text-blue-800 text-sm leading-relaxed prose prose-blue">
                    {aiResponse.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Call-to-Action */}
      <footer className="bg-white border-t border-slate-200 px-8 py-3 flex items-center justify-between text-xs text-slate-400">
        <div>Built for Advanced Data Structures Laboratory</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
