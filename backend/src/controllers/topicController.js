const Topic = require('../models/Topic');
const Module = require('../models/Module');
const ContentBlock = require('../models/ContentBlock');

// @desc    Get all topics for a module
// @route   GET /api/modules/:moduleId/topics
// @access  Public
const getTopics = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const topics = await Topic.find({ module: moduleId })
      .populate('contentBlocks')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('contentBlocks')
      .populate({
        path: 'module',
        populate: {
          path: 'course',
          select: 'title'
        }
      });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new topic
// @route   POST /api/modules/:moduleId/topics
// @access  Private
const createTopic = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, description, order, duration } = req.body;

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic title'
      });
    }

    // Get the next order number if not provided
    let topicOrder = order;
    if (!topicOrder) {
      const lastTopic = await Topic.findOne({ module: moduleId }).sort({ order: -1 });
      topicOrder = lastTopic ? lastTopic.order + 1 : 1;
    }

    const topic = await Topic.create({
      title,
      description: description || '',
      module: moduleId,
      order: topicOrder,
      duration: duration || 0,
      contentBlocks: []
    });

    // Add topic to module
    module.topics.push(topic._id);
    await module.save();

    // Populate the topic before sending response
    const populatedTopic = await Topic.findById(topic._id)
      .populate('contentBlocks')
      .populate({
        path: 'module',
        populate: {
          path: 'course',
          select: 'title'
        }
      });

    res.status(201).json({
      success: true,
      data: populatedTopic
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private
const updateTopic = async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('contentBlocks')
     .populate({
       path: 'module',
       populate: {
         path: 'course',
         select: 'title'
       }
     });

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Delete all associated content blocks
    await ContentBlock.deleteMany({ _id: { $in: topic.contentBlocks } });

    // Remove topic from module
    await Module.findByIdAndUpdate(
      topic.module,
      { $pull: { topics: topic._id } }
    );

    // Delete the topic
    await Topic.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Topic and all associated content blocks deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Reorder topics
// @route   PUT /api/modules/:moduleId/topics/reorder
// @access  Private
const reorderTopics = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { topicIds } = req.body; // Array of topic IDs in new order

    if (!Array.isArray(topicIds)) {
      return res.status(400).json({
        success: false,
        message: 'topicIds must be an array'
      });
    }

    // Update order for each topic
    const updatePromises = topicIds.map((topicId, index) => 
      Topic.findByIdAndUpdate(topicId, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    // Get updated topics
    const topics = await Topic.find({ module: moduleId })
      .populate('contentBlocks')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: topics,
      message: 'Topics reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering topics:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  reorderTopics
};
