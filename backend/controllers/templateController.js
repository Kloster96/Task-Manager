const TaskTemplate = require('../models/TaskTemplate');

const getTemplates = async (req, res) => {
    try {
        const templates = await TaskTemplate.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createTemplate = async (req, res) => {
    try {
        const template = await TaskTemplate.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteTemplate = async (req, res) => {
    try {
        const template = await TaskTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await template.deleteOne();
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getTemplates, createTemplate, deleteTemplate };