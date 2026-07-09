import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const experience = [
  {
    year: '2024 - Present',
    role: 'Full Stack Developer',
    company: 'Freelance',
    description: 'Building production-grade web applications with React, Node.js, and Supabase',
    achievements: [
      'Developed e-commerce platform with Stripe integration',
      'Built career management platform with AI features',
      'Implemented secure authentication and payment systems',
    ],
  },
  {
    year: '2023 - 2024',
    role: 'Project Manager',
    company: 'Tech Startup',
    description: 'Led cross-functional teams to deliver complex software projects',
    achievements: [
      'Managed 5+ projects simultaneously',
      'Improved delivery time by 30%',
      'Coordinated between design, dev, and business teams',
    ],
  },
];

const skills = {
  'Frontend': ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  'Backend': ['Node.js', 'Express', 'REST APIs', 'PostgreSQL'],
  'Database': ['Supabase', 'PostgreSQL', 'Database Design'],
  'Tools': ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma'],
  'Other': ['Project Management', 'Agile', 'UI/UX Design', 'API Integration'],
};

const Resume = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/home')}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>

          <h1 className="text-5xl font-bold text-white mb-4">Resume</h1>
          <p className="text-xl text-gray-400 mb-8">
            Sreshtha Saxena - Project Manager + Full Stack Developer
          </p>

          <button className="glass px-6 py-3 rounded-lg text-primary border border-primary/50 hover:border-primary transition-all glow-purple">
            Download Resume (PDF)
          </button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Experience</h2>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

            <div className="space-y-12 ml-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="relative"
                >
                  <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  
                  <div className="glass p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                        <p className="text-accent">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">{exp.year}</span>
                    </div>

                    <p className="text-gray-400 mb-4">{exp.description}</p>

                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-primary mt-1">▹</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-primary mb-4">{category}</h3>
                <div className="space-y-2">
                  {skillList.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-gray-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => navigate('/contact')}
            className="glass px-8 py-4 rounded-lg text-lg font-semibold text-white border border-accent/50 hover:border-accent transition-all glow-gold"
          >
            Let's Work Together
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Resume;
