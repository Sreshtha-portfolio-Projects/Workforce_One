import { Request, Response } from 'express';
import { projectService } from '../services/projectService';

export const projectController = {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await projectService.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
  },

  async getProjectById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const project = await projectService.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch project' });
    }
  },
};
