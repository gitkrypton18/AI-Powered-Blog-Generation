import Blog from '../models/blog.model.js';
import aiService from '../services/ai.service.js';
import { validateBlogInput, sanitizeInput } from '../utils/validation.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';


export const generateCompleteBlog = asyncHandler(async (req, res) => {
  const { topic, tone, format } = req.body;

  const validation = validateBlogInput(topic, tone);
  if (!validation.isValid) {
    throw new AppError('Validation failed', 400, validation.errors);
  }

  const sanitizedTopic = sanitizeInput(topic);
  const sanitizedTone = tone.trim();
  const requestedFormat = (format || 'text').toLowerCase();

  const { blogText, images, title } = await aiService.generateCompleteBlog(
    sanitizedTopic,
    sanitizedTone,
    requestedFormat
  );

  const looksLikeHTML = /<\w+[^>]*>/.test(blogText || '');
  let finalContent = blogText || '';

  if (requestedFormat === 'markdown') {
    if (looksLikeHTML) {
      const TurndownService = (await import('turndown')).default;
      const td = new TurndownService({ headingStyle: 'atx' });
      finalContent = td.turndown(finalContent);
    }
  } else if (requestedFormat === 'text' || requestedFormat === 'plain' || requestedFormat === 'plaintext') {
    if (looksLikeHTML) {
      const TurndownService = (await import('turndown')).default;
      const td = new TurndownService({ headingStyle: 'atx' });
      let plain = td.turndown(finalContent);
      plain = plain
        .replace(/[#!*_`>\-]+/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      finalContent = plain;
    }
  }

  const blog = await Blog.create({
    userId: req.userId,
    title: title || sanitizedTopic,
    tone: sanitizedTone,
    content: finalContent,
    images: images,
  });

  res.status(201).json({
    success: true,
    message: 'Blog generated successfully',
    data: {
      blogId: blog._id,
      title: blog.title,
      tone: blog.tone,
      content: blog.content,
      images: blog.images || [],
      createdAt: blog.createdAt
    }
  });
});


export const getBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});


export const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('title tone createdAt images');

  const total = await Blog.countDocuments({ userId: req.userId });

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, content } = req.body;

  const blog = await Blog.findOne({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  if (title) blog.title = sanitizeInput(title);
  if (content) blog.content = content;

  await blog.save();

  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog
  });
});


export const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOneAndDelete({
    _id: blogId,
    userId: req.userId
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully'
  });
});
