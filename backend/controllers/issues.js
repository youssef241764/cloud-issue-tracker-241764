
const issueService = require('../services/issueService');

function listIssues(req, res, next) {
  try {
    const issues = issueService.getAllIssues();
    res.status(200).json({ data: issues });
  } catch (error) {
    next(error);
  }
}

function createIssue(req, res, next) {
  try {
    const { title, description, priority } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof description !== 'string' ||
      !description.trim() ||
      !['Low', 'Medium', 'High'].includes(priority)
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ISSUE',
          message: 'Provide a title, description, and valid priority (Low, Medium, or High).'
        }
      });
    }

    const issue = issueService.createIssue({
      title: title.trim(),
      description: description.trim(),
      priority
    });

    res.status(201).json({ data: issue });
  } catch (error) {
    next(error);
  }
}

function updateIssueStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_STATUS',
          message: 'Status must be Open, In Progress, Resolved, or Closed.'
        }
      });
    }

    const issue = issueService.updateIssueStatus(req.params.id, status);

    if (!issue) {
      return res.status(404).json({
        error: {
          code: 'ISSUE_NOT_FOUND',
          message: 'The requested issue was not found.'
        }
      });
    }

    res.status(200).json({ data: issue });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listIssues,
  createIssue,
  updateIssueStatus
};
