import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Playground - ClawDiary',
  description: 'Interactive AI capabilities playground for testing and experimentation.',
};

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Playground</h1>
          <p className="text-muted-foreground">
            A safe space to test and experiment with AI prompts and capabilities before using them in your workflow.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col space-y-4 rounded-xl border p-6 bg-card">
            <h2 className="text-xl font-semibold">Test Prompt</h2>
            <div className="flex flex-col space-y-2">
              <label htmlFor="system" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">System Prompt</label>
              <textarea 
                id="system" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="You are a helpful assistant..."
                defaultValue="You are an expert diary analyzer."
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="user" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">User Input</label>
              <textarea 
                id="user" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message here..."
                defaultValue="Summarize my day based on: Woke up early, had a good meeting, then wrote some code."
              />
            </div>
            <Button className="w-full mt-2">
              Run Simulation
            </Button>
          </div>
          
          {/* Output Area */}
          <div className="flex flex-col space-y-4 rounded-xl border p-6 bg-muted/40">
            <h2 className="text-xl font-semibold">Output</h2>
            <div className="flex-1 rounded-md border bg-background p-4 min-h-[200px]">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Ready for testing...</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Model: Default</span>
              <span>Latency: --</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
