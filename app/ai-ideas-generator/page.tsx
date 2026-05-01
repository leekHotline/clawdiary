"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lightbulb, Sparkles, Zap } from "lucide-react";

export default function AIIdeasGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const generateIdeas = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIdeas([
        {
          id: 1,
          title: "AI Voice Journal",
          description: "A diary app that transcribes your voice entries and analyzes emotional tone.",
          tags: ["Voice", "Emotion", "Journaling"],
          score: 95
        },
        {
          id: 2,
          title: "Personal AI Mentor",
          description: "An AI that learns your goals and provides daily actionable advice.",
          tags: ["Coaching", "Productivity", "Personal Growth"],
          score: 88
        },
        {
          id: 3,
          title: "Memory Synthesizer",
          description: "Connects scattered notes and thoughts into coherent long-form articles.",
          tags: ["Writing", "Knowledge Management", "Synthesis"],
          score: 92
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          AI Ideas Generator
        </h1>
        <p className="text-gray-500 text-lg">
          Stuck on what to build next? Let AI spark some inspiration.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <Button 
          size="lg" 
          onClick={generateIdeas} 
          disabled={loading}
          className="gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? "Generating..." : "Generate New Ideas"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{idea.title}</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  {idea.score}
                </Badge>
              </CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ideas.length === 0 && !loading && (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed rounded-lg">
          Click the button above to generate some fresh AI product ideas!
        </div>
      )}
    </div>
  );
}
