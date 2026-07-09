import { supabase } from '../config/supabase';

const mockProjects = [
  {
    id: 'aldorado-jewells',
    name: 'Aldorado Jewells',
    description: 'E-commerce platform for jewelry with advanced cart and payment flow',
    tech: ['React', 'Node.js', 'Supabase', 'Stripe'],
    image: null,
    github_url: null,
    live_url: null,
  },
  {
    id: 'careerhub',
    name: 'CareerHub',
    description: 'ATS Resume Checker + Resume Builder + Job Application Tracker',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    image: null,
    github_url: null,
    live_url: null,
  },
];

export const projectService = {
  async getAllProjects() {
    if (!supabase) {
      return mockProjects;
    }
    
    try {
      const { data, error } = await supabase.from('projects').select('*');
      
      if (error) {
        console.warn('Database error, using mock data:', error.message);
        return mockProjects;
      }
      
      return data ?? mockProjects;
    } catch (error) {
      console.warn('Failed to fetch from database, using mock data');
      return mockProjects;
    }
  },

  async getProjectById(id: string) {
    if (!supabase) {
      return mockProjects.find(p => p.id === id);
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Database error, using mock data:', error.message);
        return mockProjects.find(p => p.id === id);
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to fetch from database, using mock data');
      return mockProjects.find(p => p.id === id);
    }
  },
};
