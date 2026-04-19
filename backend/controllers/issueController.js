const Issue = require("../models/Issue");
const paginate = require("../utils/pagination");

module.exports = {
  // @desc    Get all issues
  // @route   GET /api/issues
  getIssues: async function (req, res) {
    try {
      const result = await paginate(Issue, {}, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Get single issue
  // @route   GET /api/issues/:id
  getIssue: async function (req, res) {
    try {
      const issue = await Issue.findById(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      res.status(200).json(issue);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Create new issue
  // @route   POST /api/issues
  createIssue: async function (req, res) {
    try {
      if (Array.isArray(req.body)) {
        // Bulk create
        const issuesToCreate = req.body.map((issue) => ({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
        }));

        if (
          issuesToCreate.some((issue) => !issue.title || !issue.description)
        ) {
          return res.status(400).json({
            message: "Title and description are required for all issues",
          });
        }

        const issues = await Issue.create(issuesToCreate);
        return res.status(201).json(issues);
      }

      // Single create
      const { title, description, status, priority } = req.body;
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required" });
      }
      const issue = await Issue.create({
        title,
        description,
        status,
        priority,
      });
      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Update issue
  // @route   PUT /api/issues/:id
  updateIssue: async function (req, res) {
    try {
      const issue = await Issue.findById(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      const updatedIssue = await Issue.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      res.status(200).json(updatedIssue);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Delete issue
  // @route   DELETE /api/issues/:id
  deleteIssue: async function (req, res) {
    try {
      const issue = await Issue.findById(req.params.id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      await issue.deleteOne();
      res.status(200).json({ id: req.params.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
