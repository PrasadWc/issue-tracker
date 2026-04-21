const Issue = require("../models/Issue");
const paginate = require("../utils/pagination");

module.exports = {
  // @desc    Get all issues
  // @route   GET /api/issues
  getIssues: async function (req, res) {
    try {
      const { priority, status, searchKey, assignee, createdBy } = req.query;
      let filter = {};

      if (priority) filter.priority = priority;
      if (status) filter.status = status;
      if (assignee) filter.assignee = assignee;
      if (createdBy) filter.createdBy = createdBy;
      if (searchKey) {
        filter.title = { $regex: searchKey, $options: "i" };
      }

      const result = await paginate(Issue, filter, {
        ...req.query,
        populate: [
          { path: "createdBy", select: "_id name email" },
          { path: "assignee", select: "_id name email" },
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Get single issue
  // @route   GET /api/issues/:id
  getIssue: async function (req, res) {
    try {
      const issue = await Issue.findById(req.params.id).populate([
        { path: "createdBy", select: "_id name email" },
        { path: "assignee", select: "_id name email" },
      ]);
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
          createdBy: req.user.id,
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
        createdBy: req.user.id,
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

      // Update fields
      Object.keys(req.body).forEach((key) => {
        issue[key] = req.body[key];
      });

      const updatedIssue = await issue.save();
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
