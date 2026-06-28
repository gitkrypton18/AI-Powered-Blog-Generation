import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const blogPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert blog writer. Write a comprehensive, engaging blog post.

STRICT RULES:
- Return ONLY the raw HTML and title. NO markdown code blocks (no \`\`\`).
- NO introductory text like "Here is your blog" or explanations.
- Use this EXACT format:

TITLE: <catchy blog title>
---
<h2>Introduction</h2>
<p>Your content here...</p>
<h2>Section 1</h2>
<p>...</p>`,
  ],
  ['human', 'Topic: {topic}\nTone: {tone}\nLength: 800-1200 words.'],
]);

const rewritePrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert editor. Rewrite the following text in a {tone} tone.
Keep the same meaning and key information, but improve the writing quality and adjust the tone.
Output ONLY the rewritten text — no explanations, no quotes, no prefixes like "Here is".`,
  ],
  ['human', '{text}'],
]);

const seoPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an SEO expert. Improve the following text for search engine optimization.
Naturally incorporate these target keywords: {keywords}
Guidelines:
- Maintain readability and natural flow
- Don't keyword-stuff — integrate keywords organically
- Keep the original meaning and tone intact
Output ONLY the improved text — no explanations, no quotes, no prefixes.`,
  ],
  ['human', '{text}'],
]);

const tonePrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert editor specializing in tone adaptation.
Rewrite the following text in a {newTone} tone.
Preserve the core meaning, facts, and structure while shifting the writing style.
Output ONLY the rewritten text — no explanations, no quotes, no prefixes.`,
  ],
  ['human', '{text}'],
]);

// ─── AI Service Class ────────────────────────────────────────────────────────

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;

    if (!this.apiKey) {
      throw new Error(
        'Groq API key not configured. Please set GROQ_API_KEY environment variable. Get one free at https://console.groq.com'
      );
    }

    this.llm = new ChatGroq({
      apiKey: this.apiKey,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Unsplash API config
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.unsplashApiUrl = 'https://api.unsplash.com/search/photos';
  }

  /**
   * Generate a complete blog post with images.
   *
   * 3. RunnableSequence (.pipe() operator) — Chain Composition
   * Chains components together: prompt → model. The .pipe() operator creates a RunnableSequence.
   * This is LangChain's core abstraction — compose workflows as a single callable unit.
   *
   * @param {string} topic - The blog topic
   * @param {string} tone - The writing tone (professional, fun, concise)
   * @returns {{ blogText: string, images: Array }} Blog content and image array
   */
  async generateCompleteBlog(topic, tone, format = 'text') {
    try {
      // Chain: prompt → LLM (using .pipe())
      const chain = blogPrompt.pipe(this.llm);

      const response = await chain.invoke({
        topic: topic,
        tone: tone || 'professional',
      });

      let raw = response.content;

      // === STEP 1: Strip markdown code blocks (```html ... ```) ===
      raw = raw.replace(/```(?:html|markdown)?\n?([\s\S]*?)```/g, '$1').trim();

      // === STEP 2: Remove common LLM prefixes/chatter ===
      const chatterPatterns = [
        /^Here (?:is|are) (?:your|the) blog post[s]?:?\s*/i,
        /^Sure!?\s*/i,
        /^Okay,?\s*/i,
        /^Certainly!?\s*/i,
        /^I've (?:created|written|generated)\s*/i,
        /^Below is\s*/i,
      ];
      for (const pattern of chatterPatterns) {
        raw = raw.replace(pattern, '');
      }

      // === STEP 3: Extract TITLE and BODY ===
      const titleMatch = raw.match(/TITLE:\s*(.+?)(?=\n---|\n\n|BODY:|$)/i);
      const bodyMatch = raw.match(/(?:---|BODY:)\s*\n([\s\S]+)/i);

      let title = titleMatch ? titleMatch[1].trim() : topic;
      let blogText = bodyMatch ? bodyMatch[1].trim() : raw;

      // If no structured format found, try to use the whole thing as body
      if (!blogText || blogText.length < 50) {
        blogText = raw.replace(/TITLE:\s*.+/i, '').trim();
      }

      // === STEP 4: Clean up the HTML body ===
      // Remove any remaining "TITLE:" line if it leaked into body
      blogText = blogText.replace(/^TITLE:\s*.+\n?/im, '').trim();
      // Remove leading "---" or "BODY:" if present
      blogText = blogText.replace(/^(?:---|BODY:)\s*/, '').trim();

      // === CONVERT TO PLAIN TEXT IF REQUESTED ===
      if (format === 'text' || format === 'plain' || format === 'plaintext') {
        blogText = blogText
          .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n')     // headings → text
          .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')                   // paragraphs → text
          .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')               // list items
          .replace(/<ul[^>]*>|<ol[^>]*>|<\/ul>|<\/ol>/gi, '\n')      // remove list wrappers
          .replace(/<br\s*\/?>/gi, '\n')                              // line breaks
          .replace(/<[^>]+>/g, '')                                   // strip remaining tags
          .replace(/\n{3,}/g, '\n\n')                                // clean extra newlines
          .trim();
      }

      // Fetch images based on generated title
      const images = await this.fetchUnsplashImages(title, 3);

      return {
        blogText: blogText,
        images: images,
        title: title,
      };
    } catch (error) {
      this._handleError(error, 'generate blog content');
    }
  }

  /**
   * Rewrite selected text in a given tone.
   * @param {string} text - The text to rewrite
   * @param {string} tone - The target tone
   * @returns {string} Rewritten text
   */
  async rewriteText(text, tone) {
    try {
      const chain = rewritePrompt.pipe(this.llm);

      const response = await chain.invoke({
        text: text,
        tone: tone || 'professional',
      });

      return response.content?.trim() || text;
    } catch (error) {
      this._handleError(error, 'rewrite text');
    }
  }

  /**
   * Improve text for SEO with target keywords.
   * @param {string} text - The text to optimize
   * @param {string|string[]} keywords - SEO keywords
   * @returns {string} SEO-optimized text
   */
  async improveSEO(text, keywords) {
    try {
      const keywordsString = Array.isArray(keywords)
        ? keywords.join(', ')
        : keywords || '';

      const chain = seoPrompt.pipe(this.llm);

      const response = await chain.invoke({
        text: text,
        keywords: keywordsString,
      });

      return response.content?.trim() || text;
    } catch (error) {
      this._handleError(error, 'improve SEO');
    }
  }

  /**
   * Change the tone of the given text.
   * @param {string} text - The text to transform
   * @param {string} newTone - The new target tone
   * @returns {string} Tone-shifted text
   */
  async changeTone(text, newTone) {
    try {
      const chain = tonePrompt.pipe(this.llm);

      const response = await chain.invoke({
        text: text,
        newTone: newTone,
      });

      return response.content?.trim() || text;
    } catch (error) {
      this._handleError(error, 'change tone');
    }
  }

  /**
   * Fetch real professional photos from Unsplash API based on search query (blog title).
   * Falls back to Pollinations AI if Unsplash key is missing or API fails.
   *
   * @param {string} query - Search query (usually the blog title)
   * @param {number} count - Number of images to fetch (default 3)
   * @returns {Array} Array of image objects with url, prompt, source, index, photographer info
   */
  async fetchUnsplashImages(query, count = 3) {
    if (!this.unsplashAccessKey) {
      console.warn('UNSPLASH_ACCESS_KEY not set. Falling back to Pollinations AI.');
      return this._generatePollinationsImages(query, count);
    }

    try {
      const response = await axios.get(this.unsplashApiUrl, {
        headers: {
          Authorization: `Client-ID ${this.unsplashAccessKey}`,
        },
        params: {
          query: query,
          per_page: count,
          orientation: 'landscape',
          order_by: 'relevant',
        },
        timeout: 5000,
      });

      const photos = response.data.results || [];

      if (photos.length === 0) {
        console.warn(`No Unsplash results for "${query}". Falling back to Pollinations.`);
        return this._generatePollinationsImages(query, count);
      }

      return photos.map((photo, index) => ({
        url: photo.urls.regular,
        smallUrl: photo.urls.small,
        thumbUrl: photo.urls.thumb,
        prompt: photo.alt_description || photo.description || query,
        source: 'unsplash',
        index,
        photographer: photo.user?.name || 'Unknown',
        photographerUrl: photo.user?.links?.html || '',
        unsplashUrl: photo.links?.html || '',
        downloadLocation: photo.links?.download_location || '',
      }));
    } catch (error) {
      console.error('Unsplash API error:', error.response?.data || error.message);
      return this._generatePollinationsImages(query, count);
    }
  }

  /**
   * Fallback image generation via Pollinations AI (no API key needed).
   * Used when Unsplash API key is missing or Unsplash API fails.
   */
  _generatePollinationsImages(query, count = 3) {
    const prompts = [
      `${query}, professional blog header, high quality`,
      `${query}, editorial photography, modern`,
      `${query}, concept illustration, clean design`,
    ];

    return prompts.slice(0, count).map((prompt, index) => ({
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&nologo=true&seed=${Date.now() + index}`,
      prompt,
      source: 'pollinations',
      index,
    }));
  }

  /**
   * Trigger Unsplash download tracking.
   * Required by Unsplash API guidelines — call when user views/downloads an image.
   */
  async trackUnsplashDownload(downloadLocation) {
    if (!downloadLocation || !this.unsplashAccessKey) return;

    try {
      await axios.get(downloadLocation, {
        headers: { Authorization: `Client-ID ${this.unsplashAccessKey}` },
      });
    } catch (err) {
      console.error('Unsplash download tracking failed:', err.message);
    }
  }

  /**
   * Centralized error handler for AI service errors.
   * Maps provider-specific errors to user-friendly messages.
   */
  _handleError(error, action) {
    console.error(`AI Service Error (${action}):`, error.message);

    if (
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('Invalid API Key')
    ) {
      throw new Error(
        'Invalid Groq API key. Please check your GROQ_API_KEY environment variable.'
      );
    }

    if (
      error.message?.includes('429') ||
      error.message?.includes('rate limit') ||
      error.message?.includes('Rate limit')
    ) {
      throw new Error(
        'AI rate limit reached. Please wait a moment and try again.'
      );
    }

    if (
      error.message?.includes('timeout') ||
      error.message?.includes('ETIMEDOUT')
    ) {
      throw new Error('AI generation timed out. Please try again.');
    }

    if (
      error.message?.includes('503') ||
      error.message?.includes('Service Unavailable')
    ) {
      throw new Error(
        'AI service is temporarily unavailable. Please try again in a few minutes.'
      );
    }

    throw new Error(`Failed to ${action}: ${error.message}`);
  }
}

export default new AIService();
