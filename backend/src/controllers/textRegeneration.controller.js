import Blog from '../models/blog.model.js';
import aiService from '../services/ai.service.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const rewriteText = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { selectedText, tone } = req.body;

  if (!selectedText) {
    throw new AppError('Selected text is required', 400);
  }

  if (selectedText.trim().length < 10) {
    throw new AppError('Selected text is too short (minimum 10 characters)', 400);
  }

  if (selectedText.length > 5000) {
    throw new AppError('Selected text is too long (maximum 5000 characters)', 400);
  }

  const blog = await Blog.findOne({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const rewrittenText = await aiService.rewriteText(
    selectedText.trim(),
    tone || blog.tone
  );

  res.status(200).json({
    success: true,
    message: 'Text rewritten successfully',
    data: {
      originalText: selectedText.trim(),
      regeneratedText: rewrittenText
    }
  });
});

export const improveSEO = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { selectedText, keywords } = req.body;

  if (!selectedText) {
    throw new AppError('Selected text is required', 400);
  }

  // Verify blog exists
  const blog = await Blog.findOne({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const seoKeywords = keywords || blog.seo?.keywords || [];

  const improvedText = await aiService.improveSEO(
    selectedText.trim(),
    seoKeywords
  );

  res.status(200).json({
    success: true,
    message: 'Text improved for SEO',
    data: {
      originalText: selectedText.trim(),
      regeneratedText: improvedText
    }
  });
});

export const changeTone = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { selectedText, newTone } = req.body;

  if (!selectedText || !newTone) {
    throw new AppError('Selected text and new tone are required', 400);
  }

  const validTones = [
    'professional',
    'fun',
    'concise'
  ];

  if (!validTones.includes(newTone.toLowerCase())) {
    throw new AppError(`Invalid tone. Must be one of: Professional, Fun, Concise`, 400);
  }

  const blog = await Blog.findOne({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const changedText = await aiService.changeTone(
    selectedText.trim(),
    newTone.toLowerCase()
  );

  res.status(200).json({
    success: true,
    message: `Tone changed to ${newTone}`,
    data: {
      originalText: selectedText.trim(),
      regeneratedText: changedText,
      newTone: newTone.toLowerCase()
    }
  });
});
