import { Metadata } from 'next';
import { promptApi } from '@/services/api';
import PromptDetailClient from '@/components/PromptDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await promptApi.getPromptById(id);
    return {
      title: `${data.title} | Prompt AI`,
      description: data.description.substring(0, 160),
    };
  } catch {
    return { title: 'Prompt Not Found' };
  }
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params;
  let prompt;
  try {
    const { data } = await promptApi.getPromptById(id);
    prompt = data;
  } catch (err) {
    return <div className="site-container" style={{ padding: 'var(--space-20) 0' }}>Prompt not found.</div>;
  }

  return (
    <div className="site-container" style={{ padding: 'var(--space-12) 0' }}>
      <PromptDetailClient prompt={prompt} />
    </div>
  );
}
