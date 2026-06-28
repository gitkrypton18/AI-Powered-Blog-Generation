// Quick health check — verify Groq API connectivity
// Run: node health-check.js

import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.1-8b-instant',
});

async function healthCheck() {
  console.log('🔍 Checking Groq API connectivity...');
  console.log(`   API Key: ${process.env.GROQ_API_KEY ? '✅ Set (' + process.env.GROQ_API_KEY.substring(0, 8) + '...)' : '❌ Missing'}`);
  console.log('');

  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env file.');
    console.error('   Get a free key at https://console.groq.com');
    process.exit(1);
  }

  try {
    const start = Date.now();
    const result = await llm.invoke('Say "Groq is working" and nothing else.');
    const duration = Date.now() - start;

    console.log(`✅ Groq responded in ${duration}ms`);
    console.log(`   Model: llama-3.3-70b-versatile`);
    console.log(`   Response: "${result.content.trim()}"`);
    console.log('');
    console.log('🎉 Your AI-Blog backend is ready to go!');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);

    if (err.message.includes('401') || err.message.includes('Invalid API Key')) {
      console.error('   → Your GROQ_API_KEY is invalid. Check https://console.groq.com');
    } else if (err.message.includes('429')) {
      console.error('   → Rate limit hit. Wait a moment and try again.');
    }

    process.exit(1);
  }
}

healthCheck();
