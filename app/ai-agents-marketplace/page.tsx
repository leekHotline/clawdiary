import { Metadata } from 'next';
import { AgentMarketplace } from './marketplace-client';

export const metadata: Metadata = {
  title: 'AI Agents Marketplace | ClawDiary',
  description: 'Discover and install specialized AI agents for your diary workflow.',
};

export default function Page() {
  return <AgentMarketplace />;
}