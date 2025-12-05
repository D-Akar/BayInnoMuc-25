import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import ChatOptions from "@/components/ChatOptions";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <div id="faq">
        <FAQSection />
      </div>
      <div id="chat-options">
        <ChatOptions />
      </div>
    </Layout>
  );
}

