const Module = require('../models/Module');
const Course = require('../models/Course');
const Topic = require('../models/Topic');
const ContentBlock = require('../models/ContentBlock');

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
// @access  Public
const getModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const modules = await Module.find({ course: courseId })
      .populate('topics')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Public
const getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate({
        path: 'topics',
        populate: {
          path: 'contentBlocks'
        }
      })
      .populate('course', 'title');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new module
// @route   POST /api/courses/:courseId/modules
// @access  Private
const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide module title'
      });
    }

    // Get the next order number if not provided
    let moduleOrder = order;
    if (!moduleOrder) {
      const lastModule = await Module.findOne({ course: courseId }).sort({ order: -1 });
      moduleOrder = lastModule ? lastModule.order + 1 : 1;
    }

    const module = await Module.create({
      title,
      description: description || '',
      course: courseId,
      order: moduleOrder,
      topics: []
    });

    // Add module to course
    course.modules.push(module._id);
    await course.save();

    // Populate the module before sending response
    const populatedModule = await Module.findById(module._id)
      .populate('topics')
      .populate('course', 'title');

    res.status(201).json({
      success: true,
      data: populatedModule
    });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private
const updateModule = async (req, res) => {
  try {
    let module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('topics').populate('course', 'title');

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private
const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Delete all associated topics and content blocks
    for (const topicId of module.topics) {
      const topic = await Topic.findById(topicId);
      if (topic) {
        // Delete all content blocks for this topic
        await ContentBlock.deleteMany({ _id: { $in: topic.contentBlocks } });
      }
      // Delete the topic
      await Topic.findByIdAndDelete(topicId);
    }

    // Remove module from course
    await Course.findByIdAndUpdate(
      module.course,
      { $pull: { modules: module._id } }
    );

    // Delete the module
    await Module.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Module and all associated content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Reorder modules
// @route   PUT /api/courses/:courseId/modules/reorder
// @access  Private
const reorderModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleIds } = req.body; // Array of module IDs in new order

    if (!Array.isArray(moduleIds)) {
      return res.status(400).json({
        success: false,
        message: 'moduleIds must be an array'
      });
    }

    // Update order for each module
    const updatePromises = moduleIds.map((moduleId, index) => 
      Module.findByIdAndUpdate(moduleId, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    // Get updated modules
    const modules = await Module.find({ course: courseId })
      .populate('topics')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: modules,
      message: 'Modules reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  reorderModules
};
