const Course = require('../models/Course');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const ContentBlock = require('../models/ContentBlock');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: 'modules',
        populate: {
          path: 'topics',
          populate: {
            path: 'contentBlocks'
          }
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'modules',
        populate: {
          path: 'topics',
          populate: {
            path: 'contentBlocks'
          }
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      price,
      thumbnail,
      tags,
      isPublished
    } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      difficulty: difficulty || 'Beginner',
      duration: duration || 0,
      price: price || 0,
      thumbnail,
      tags: tags || [],
      isPublished: isPublished || false,
      modules: []
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete all associated modules, topics, and content blocks
    for (const moduleId of course.modules) {
      const module = await Module.findById(moduleId);
      if (module) {
        for (const topicId of module.topics) {
          const topic = await Topic.findById(topicId);
          if (topic) {
            // Delete all content blocks for this topic
            await ContentBlock.deleteMany({ _id: { $in: topic.contentBlocks } });
          }
          // Delete the topic
          await Topic.findByIdAndDelete(topicId);
        }
        // Delete the module
        await Module.findByIdAndDelete(moduleId);
      }
    }

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and all associated content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish course
// @route   PUT /api/courses/:id/publish
// @access  Private
const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.isPublished = !course.isPublished;
    course.publishedAt = course.isPublished ? new Date() : null;
    
    await course.save();

    res.status(200).json({
      success: true,
      data: course,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    console.error('Error toggling course publish status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  togglePublishCourse
};
