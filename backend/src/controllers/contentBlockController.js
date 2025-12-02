const ContentBlock = require('../models/ContentBlock');
const Topic = require('../models/Topic');

// @desc    Get all content blocks for a topic
// @route   GET /api/topics/:topicId/content-blocks
// @access  Public
const getContentBlocks = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const contentBlocks = await ContentBlock.find({ topic: topicId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: contentBlocks.length,
      data: contentBlocks
    });
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single content block
// @route   GET /api/content-blocks/:id
// @access  Public
const getContentBlock = async (req, res) => {
  try {
    const contentBlock = await ContentBlock.findById(req.params.id)
      .populate({
        path: 'topic',
        populate: {
          path: 'module',
          populate: {
            path: 'course',
            select: 'title'
          }
        }
      });

    if (!contentBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contentBlock
    });
  } catch (error) {
    console.error('Error fetching content block:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new content block
// @route   POST /api/topics/:topicId/content-blocks
// @access  Private
const createContentBlock = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { type, title, content, settings, order } = req.body;

    // Check if topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Validation
    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide content block type and title'
      });
    }

    // Get the next order number if not provided
    let blockOrder = order;
    if (!blockOrder) {
      const lastBlock = await ContentBlock.findOne({ topic: topicId }).sort({ order: -1 });
      blockOrder = lastBlock ? lastBlock.order + 1 : 1;
    }

    const contentBlock = await ContentBlock.create({
      type,
      title,
      content: content || '',
      settings: settings || {},
      topic: topicId,
      order: blockOrder
    });

    // Add content block to topic
    topic.contentBlocks.push(contentBlock._id);
    await topic.save();

    // Populate the content block before sending response
    const populatedContentBlock = await ContentBlock.findById(contentBlock._id)
      .populate({
        path: 'topic',
        populate: {
          path: 'module',
          populate: {
            path: 'course',
            select: 'title'
          }
        }
      });

    res.status(201).json({
      success: true,
      data: populatedContentBlock
    });
  } catch (error) {
    console.error('Error creating content block:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update content block
// @route   PUT /api/content-blocks/:id
// @access  Private
const updateContentBlock = async (req, res) => {
  try {
    let contentBlock = await ContentBlock.findById(req.params.id);

    if (!contentBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    contentBlock = await ContentBlock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'topic',
      populate: {
        path: 'module',
        populate: {
          path: 'course',
          select: 'title'
        }
      }
    });

    res.status(200).json({
      success: true,
      data: contentBlock
    });
  } catch (error) {
    console.error('Error updating content block:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete content block
// @route   DELETE /api/content-blocks/:id
// @access  Private
const deleteContentBlock = async (req, res) => {
  try {
    const contentBlock = await ContentBlock.findById(req.params.id);

    if (!contentBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    // Remove content block from topic
    await Topic.findByIdAndUpdate(
      contentBlock.topic,
      { $pull: { contentBlocks: contentBlock._id } }
    );

    // Delete the content block
    await ContentBlock.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Content block deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content block:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Reorder content blocks
// @route   PUT /api/topics/:topicId/content-blocks/reorder
// @access  Private
const reorderContentBlocks = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { blockIds } = req.body; // Array of content block IDs in new order

    if (!Array.isArray(blockIds)) {
      return res.status(400).json({
        success: false,
        message: 'blockIds must be an array'
      });
    }

    // Update order for each content block
    const updatePromises = blockIds.map((blockId, index) => 
      ContentBlock.findByIdAndUpdate(blockId, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    // Get updated content blocks
    const contentBlocks = await ContentBlock.find({ topic: topicId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: contentBlocks,
      message: 'Content blocks reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering content blocks:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Duplicate content block
// @route   POST /api/content-blocks/:id/duplicate
// @access  Private
const duplicateContentBlock = async (req, res) => {
  try {
    const originalBlock = await ContentBlock.findById(req.params.id);

    if (!originalBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    // Get the next order number
    const lastBlock = await ContentBlock.findOne({ topic: originalBlock.topic }).sort({ order: -1 });
    const newOrder = lastBlock ? lastBlock.order + 1 : 1;

    // Create duplicate
    const duplicateBlock = await ContentBlock.create({
      type: originalBlock.type,
      title: `${originalBlock.title} (Copy)`,
      content: originalBlock.content,
      settings: originalBlock.settings,
      topic: originalBlock.topic,
      order: newOrder
    });

    // Add to topic
    await Topic.findByIdAndUpdate(
      originalBlock.topic,
      { $push: { contentBlocks: duplicateBlock._id } }
    );

    // Populate the duplicate block before sending response
    const populatedDuplicate = await ContentBlock.findById(duplicateBlock._id)
      .populate({
        path: 'topic',
        populate: {
          path: 'module',
          populate: {
            path: 'course',
            select: 'title'
          }
        }
      });

    res.status(201).json({
      success: true,
      data: populatedDuplicate,
      message: 'Content block duplicated successfully'
    });
  } catch (error) {
    console.error('Error duplicating content block:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getContentBlocks,
  getContentBlock,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  reorderContentBlocks,
  duplicateContentBlock
};
