import { Request, Response } from 'express';
import { contactService } from '../services/contactService';

export const contactController = {
  async sendMessage(req: Request, res: Response) {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, email, and message are required' 
        });
      }

      const result = await contactService.saveMessage({ name, email, message });
      
      res.json({ 
        success: true, 
        message: 'Message received successfully',
        data: result 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  },
};
