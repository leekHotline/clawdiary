"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, Copy, Check, ArrowRight, Lightbulb, Zap, RefreshCw } from 'lucide-react'

export default function PromptOptimizerPage() {
  const [inputPrompt, setInputPrompt] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const handleOptimize = () => {
    if (!inputPrompt.trim()) return
    
    setIsOptimizing(true)
    // 模拟 API 调用延迟
    setTimeout(() => {
      // 简单的提示词扩展逻辑（模拟）
      const enhanced = `Act as an expert assistant. Context: You are highly knowledgeable and precise. 
Task: ${inputPrompt}
Constraints: 
- Provide step-by-step reasoning
- Keep the tone professional yet accessible
- Format the output with clear headings and bullet points where applicable
Goal: Ensure the response is directly actionable and thoroughly explains the "why" behind the "what".`
      
      setOptimizedPrompt(enhanced)
      setIsOptimizing(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    if (!optimizedPrompt) return
    navigator.clipboard.writeText(optimizedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    "写一封辞职信",
    "解释量子计算",
    "帮我复习面试",
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
            <Wand2 className="w-4 h-4" />
            AI Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Prompt Optimizer <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Turn your simple requests into highly effective, context-rich prompts that get the best results from any LLM.
          </p>
        </div>

        {/* Main Work Area */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          
          {/* Input Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                1
              </div>
              <h2 className="text-xl font-bold text-slate-800">Your Request</h2>
            </div>
            
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g., Explain quantum computing to a 5-year-old..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-slate-500 flex items-center gap-1 mr-2">
                <Lightbulb className="w-4 h-4" /> Try:
              </span>
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInputPrompt(ex)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full transition-colors border border-slate-200"
                >
                  {ex}
                </button>
              ))}
            </div>

            <button
              onClick={handleOptimize}
              disabled={!inputPrompt.trim() || isOptimizing}
              className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Optimize Prompt
                </>
              )}
            </button>
          </motion.div>

          {/* Output Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold text-slate-800">Optimized Result</h2>
              </div>
              
              {optimizedPrompt && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            
            <div className={`w-full h-64 p-4 rounded-xl overflow-y-auto border ${optimizedPrompt ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200 flex items-center justify-center'}`}>
              {optimizedPrompt ? (
                <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                  {optimizedPrompt}
                </pre>
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <Zap className="w-8 h-8 mx-auto opacity-50" />
                  <p>Your optimized prompt will appear here.</p>
                </div>
              )}
            </div>
            
            {optimizedPrompt && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                <Check className="w-4 h-4 flex-shrink-0" />
                <p>Ready to use! Paste this into ChatGPT, Claude, or your favorite AI.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  )
}