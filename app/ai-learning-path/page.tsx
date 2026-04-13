"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Circle, ArrowRight, Brain, Zap, Target } from "lucide-react"

export default function AILearningPath() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(stepId => stepId !== id))
    } else {
      setCompletedSteps([...completedSteps, id])
    }
  }

  const paths = [
    {
      id: 1,
      title: "Foundations of AI",
      description: "Understand the basic concepts, terminology, and how Large Language Models work.",
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      steps: [
        { id: 101, title: "What is Generative AI?", duration: "15 min" },
        { id: 102, title: "How LLMs process text", duration: "20 min" },
        { id: 103, title: "Limitations and Hallucinations", duration: "10 min" }
      ]
    },
    {
      id: 2,
      title: "Prompt Engineering 101",
      description: "Learn how to talk to AI effectively to get the exact results you want.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      steps: [
        { id: 201, title: "The anatomy of a good prompt", duration: "20 min" },
        { id: 202, title: "Few-shot prompting techniques", duration: "25 min" },
        { id: 203, title: "Role-playing and constraints", duration: "15 min" }
      ]
    },
    {
      id: 3,
      title: "AI in Daily Workflow",
      description: "Practical applications of AI for writing, coding, and problem-solving.",
      icon: <Target className="w-6 h-6 text-blue-500" />,
      steps: [
        { id: 301, title: "Automating routine tasks", duration: "30 min" },
        { id: 302, title: "Brainstorming and ideation", duration: "20 min" },
        { id: 303, title: "Data analysis basics with AI", duration: "25 min" }
      ]
    }
  ]

  const totalSteps = paths.reduce((acc, path) => acc + path.steps.length, 0)
  const progress = Math.round((completedSteps.length / totalSteps) * 100) || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Learning Path</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Master Artificial Intelligence step by step. From basic concepts to advanced practical applications.
              </p>
              
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Path Modules */}
        <div className="space-y-6">
          {paths.map((path, index) => (
            <motion.div 
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                    {path.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Module {index + 1}: {path.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{path.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {path.steps.map((step) => {
                  const isCompleted = completedSteps.includes(step.id)
                  return (
                    <div 
                      key={step.id} 
                      onClick={() => toggleStep(step.id)}
                      className={`p-5 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        isCompleted ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 shrink-0" />
                        )}
                        <div>
                          <h3 className={`font-medium ${isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {step.title}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                            ⏱ {step.duration}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
