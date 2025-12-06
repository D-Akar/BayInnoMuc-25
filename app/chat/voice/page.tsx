import VoiceChatInterface from "@/components/VoiceChatInterface";

// Force dynamic rendering since this page uses client-side hooks
export const dynamic = 'force-dynamic';

export default function VoiceChatPage() {
  return <VoiceChatInterface />;
}

