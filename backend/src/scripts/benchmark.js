import aiService from '../services/ai.service.js';
import dotenv from 'dotenv';

dotenv.config();

const TOPIC = 'The future of renewable energy';
const TONE = 'professional';

async function benchmark(name, method, ...args) {
  console.log(`\n🚀 Testing: ${name}`);
  const start = Date.now();
  try {
    const result = await aiService[method](...args);
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ Success in ${duration}s`);

    if (result.blogText) {
      console.log(`   Content length: ${result.blogText.length} chars`);
      console.log(`   Images: ${result.images?.length || 0}`);
      console.log(`   First 200 chars: ${result.blogText.substring(0, 200)}...`);
    } else {
      console.log(`   Content length: ${result.length} chars`);
      console.log(`   First 200 chars: ${result.substring(0, 200)}...`);
    }

    return { name, duration: parseFloat(duration), success: true };
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`❌ Failed after ${duration}s: ${err.message}`);
    return { name, duration: parseFloat(duration), success: false, error: err.message };
  }
}

async function runBenchmark() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  AI-Blog LangChain.js + Groq Benchmark');
  console.log('═══════════════════════════════════════════════════');

  if (!process.env.GROQ_API_KEY) {
    console.error('\n❌ GROQ_API_KEY not set in .env');
    process.exit(1);
  }

  const results = [];

  // Test 1: Blog Generation
  results.push(await benchmark(
    'Blog Generation',
    'generateCompleteBlog',
    TOPIC, TONE
  ));

  // Test 2: Text Rewrite
  results.push(await benchmark(
    'Text Rewrite (professional)',
    'rewriteText',
    'Hey guys, check out this awesome blog about energy!',
    'professional'
  ));

  // Test 3: SEO Improvement
  results.push(await benchmark(
    'SEO Improvement',
    'improveSEO',
    'Renewable energy is important for the future of our planet.',
    ['renewable energy', 'solar power', 'sustainability']
  ));

  // Test 4: Tone Change
  results.push(await benchmark(
    'Tone Change (concise)',
    'changeTone',
    'In this comprehensive and detailed article, we will thoroughly explore the various multifaceted aspects and considerations of renewable energy sources.',
    'concise'
  ));

  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  const maxName = Math.max(...results.map(r => r.name.length));
  for (const r of results) {
    const icon = r.success ? '✅' : '❌';
    const name = r.name.padEnd(maxName);
    console.log(`  ${icon} ${name}  ${r.duration}s`);
  }

  const successCount = results.filter(r => r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0).toFixed(2);
  console.log('');
  console.log(`  Passed: ${successCount}/${results.length}`);
  console.log(`  Total time: ${totalDuration}s`);
  console.log('═══════════════════════════════════════════════════');
}

runBenchmark();
