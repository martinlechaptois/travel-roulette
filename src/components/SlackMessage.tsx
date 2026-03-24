"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Country } from "@/lib/countries";
import { generateSlackMessage, regenerateSlackMessage } from "@/lib/slackTemplates";

interface SlackMessageProps {
  country: Country;
}

export default function SlackMessage({ country }: SlackMessageProps) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMessage(generateSlackMessage(country));
  }, [country]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setMessage(regenerateSlackMessage(country, message));
  };

  return (
    <motion.div
      className="bg-[#0a150a] border border-neon/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-neon text-sm font-bold uppercase tracking-wider">
        💬 Share on Slack
      </div>
      <div className="bg-[#060d06] rounded-lg p-3 mt-2 text-gray-300 text-sm border border-neon/5 font-mono leading-relaxed">
        {message}
      </div>
      <div className="flex gap-2 mt-3">
        <motion.button
          onClick={handleCopy}
          className="bg-transparent border border-neon/30 text-neon text-xs px-3 py-1.5 rounded hover:bg-neon/10 transition-colors cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
        </motion.button>
        <motion.button
          onClick={handleRegenerate}
          className="bg-transparent border border-neon/30 text-neon text-xs px-3 py-1.5 rounded hover:bg-neon/10 transition-colors cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          🔄 Regenerate
        </motion.button>
      </div>
    </motion.div>
  );
}
