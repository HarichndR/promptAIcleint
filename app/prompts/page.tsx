import { redirect } from 'next/navigation';

export default function PromptsPage() {
  // Gracefully transition legacy traffic to the unified root
  redirect('/');
}
