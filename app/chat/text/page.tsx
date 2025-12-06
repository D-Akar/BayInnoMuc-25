import TextChatInterface from "@/components/TextChatInterface";

// Force dynamic rendering since this page uses client-side hooks
export const dynamic = 'force-dynamic';

export default function TextChatPage() {
  return <TextChatInterface />;
}

