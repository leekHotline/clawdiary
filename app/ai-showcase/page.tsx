"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIShowcase() {
  const [activeTab, setActiveTab] = useState("all");

  const tools = [
    { name: "Code Assistant", category: "dev", desc: "AI-powered coding companion" },
    { name: "Image Gen", category: "creative", desc: "Create stunning visuals" },
    { name: "Text Summarizer", category: "productivity", desc: "Read faster with AI" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">AI Showcase</h1>
      <p className="text-lg text-muted-foreground mb-8">Discover the latest AI tools and trends.</p>

      <div className="flex gap-4 mb-8">
        <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>All</Button>
        <Button variant={activeTab === "dev" ? "default" : "outline"} onClick={() => setActiveTab("dev")}>Development</Button>
        <Button variant={activeTab === "creative" ? "default" : "outline"} onClick={() => setActiveTab("creative")}>Creative</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.filter(t => activeTab === "all" || t.category === activeTab).map(tool => (
          <Card key={tool.name}>
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{tool.desc}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">Try it out</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
