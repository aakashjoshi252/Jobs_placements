const Resume = require("../models/resume.model.js");
const mongoose = require("mongoose");
const resumeController = {
    createResume: async (req, res) => {
        try {
            const resumeData = req.body;
            const { candidateId } = resumeData;

            // If only one resume per candidate → Update instead of create
            const existingResume = await Resume.findOne({ candidateId });

            if (existingResume) {
                const updated = await Resume.findOneAndUpdate(
                    { candidateId },
                    resumeData,
                    { new: true }
                );
                return res.status(200).json({
                    message: "Resume updated successfully",
                    data: updated,
                });
            }
            const newResume = await Resume.create(resumeData);

            res.status(201).json({
                message: "Resume created successfully",
                data: newResume,
            });
        } catch (error) {
            console.error("Error saving resume:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    },

    // Get Resume by Candidate ID
    getResumeByCandidate: async (req, res) => {
        try {
            const { candidateId } = req.params; // Query param: ?name=Laptop
            if (!candidateId) return res.status(400).json({ message: "Candidate ID required" });
            const items = await Resume.find({candidateId: new mongoose.Types.ObjectId(candidateId)});
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "No resume found for this candidate" });
            }
            return res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }
    },
    // Get Resume by Resume ID
    getResumeById: async (req, res) => {
        try {
            const resume = await Resume.findById(req.params.id);
            if (!resume) {
                return res.status(404).json({ message: "Resume not found" });
            }
            res.status(200).json(resume);
        } catch (error) {
            console.error("Error fetching resume:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    },
    updateResume: async (req, res) => {
        try {
            const updated = await Resume.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updated) {
                return res.status(404).json({ message: "Resume not found" });
            }

            res.status(200).json({
                message: "Resume updated successfully",
                data: updated,
            });
        } catch (error) {
            console.error("Error updating resume:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    },
    // Delete Resume by ID
    deleteResume: async (req, res) => {
        try {
            const {id} = req.params;
            const deleted = await Resume.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({ message: "Resume not found" });
            }

            res.status(200).json({ message: "Resume deleted successfully" });
        } catch (error) {
            console.error("Error deleting resume:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    },

}

module.exports = resumeController;