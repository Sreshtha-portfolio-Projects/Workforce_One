import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const projectData = {
  'aldorado-jewells': {
    name: 'Aldorado Jewells',
    tagline: 'Luxury Jewelry E-commerce Platform',
    sections: ['Overview', 'Architecture', 'Demo Flow', 'Challenges'],
    overview: {
      description: 'A full-stack e-commerce platform for luxury jewelry with secure payment processing and real-time inventory management.',
      features: [
        'Dynamic product catalog',
        'Advanced cart management',
        'Stripe payment integration',
        'Order tracking system',
        'Admin dashboard',
        'Real-time inventory sync',
      ],
      tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'Stripe API'],
    },
    architecture: {
      diagram: `
┌─────────────────┐
│   React Frontend │
│   (Vite + TS)    │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  Node.js Backend │
│   (Express API)  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│Supabase│ │Stripe │
│  DB    │ │Payment│
└────────┘ └───────┘
      `,
      layers: [
        'Frontend: React with TypeScript, Framer Motion for animations',
        'API Layer: Node.js + Express REST endpoints',
        'Database: Supabase PostgreSQL with Row Level Security',
        'Payment: Stripe API for secure transactions',
      ],
    },
    demoFlow: {
      steps: [
        'Browse jewelry collection',
        'Add items to cart',
        'Create order intent',
        'Process payment via Stripe',
        'Verify payment webhook',
        'Order confirmation',
      ],
    },
    challenges: [
      'Implementing secure payment flow with webhook verification',
      'Real-time inventory management across concurrent users',
      'Optimizing image loading for high-resolution jewelry photos',
      'Building admin panel with role-based access control',
    ],
  },
  'careerhub': {
    name: 'CareerHub',
    tagline: 'Your Complete Career Management Platform',
    sections: ['Overview', 'Features', 'Demo', 'Tech Stack'],
    overview: {
      description: 'An all-in-one platform to help job seekers optimize resumes, track applications, and land their dream job.',
      features: [
        'ATS Resume Checker with scoring',
        'AI-powered resume builder',
        'Job application tracker',
        'Interview preparation tools',
        'Company research database',
        'Application analytics',
      ],
      tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'OpenAI API', 'PDF.js'],
    },
    features: {
      ats: {
        title: 'ATS Resume Checker',
        description: 'Upload your resume and get instant ATS compatibility score',
        highlights: [
          'Keyword matching algorithm',
          'Format compatibility check',
          'Improvement suggestions',
          'Industry-specific optimization',
        ],
      },
      builder: {
        title: 'Resume Builder',
        description: 'Create ATS-friendly resumes with AI assistance',
        highlights: [
          'Pre-built templates',
          'AI content suggestions',
          'Real-time preview',
          'Export to PDF/DOCX',
        ],
      },
      tracker: {
        title: 'Job Tracker',
        description: 'Manage all your applications in one place',
        highlights: [
          'Application status pipeline',
          'Interview scheduling',
          'Follow-up reminders',
          'Analytics dashboard',
        ],
      },
    },
    challenges: [
      'Building accurate ATS parsing algorithm',
      'Integrating OpenAI for content generation',
      'Creating flexible resume templates',
      'Implementing efficient job tracking system',
    ],
  },
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const project = id ? projectData[id as keyof typeof projectData] : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/home')}
            className="glass px-6 py-3 rounded-lg text-white border border-primary/50"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-80 glass border-r border-white/10 p-8 fixed h-screen overflow-y-auto"
      >
        <button
          onClick={() => navigate('/home')}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
        <p className="text-sm text-gray-400 mb-8">{project.tagline}</p>

        <nav className="space-y-2">
          {project.sections.map((section, index) => (
            <button
              key={section}
              onClick={() => setActiveSection(index)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeSection === index
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>

        {id === 'aldorado-jewells' && (
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full mt-8 glass px-4 py-3 rounded-lg text-accent border border-accent/50 hover:border-accent transition-all"
          >
            {showDemo ? 'Hide Demo' : 'Launch Demo'}
          </button>
        )}
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 ml-80 p-12 overflow-y-auto"
      >
        {id === 'aldorado-jewells' && (
          <>
            {activeSection === 0 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Overview</h1>
                <p className="text-lg text-gray-300 mb-8">{project.overview.description}</p>

                <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {project.overview.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.overview.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 1 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Architecture</h1>
                
                <div className="glass p-8 rounded-lg mb-8">
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                    {project.architecture.diagram}
                  </pre>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">System Layers</h3>
                <div className="space-y-4">
                  {project.architecture.layers.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-6 rounded-lg"
                    >
                      <p className="text-gray-300">{layer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 2 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Demo Flow</h1>
                
                <div className="space-y-6">
                  {project.demoFlow.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center gap-6"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="glass p-6 rounded-lg flex-1">
                        <p className="text-lg text-gray-300">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {showDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 glass p-8 rounded-lg"
                  >
                    <h3 className="text-2xl font-semibold text-white mb-6">Interactive Demo</h3>
                    <div className="space-y-4 text-gray-300">
                      <p>🛒 Cart simulation with real-time updates</p>
                      <p>💳 Stripe payment flow visualization</p>
                      <p>✅ Order confirmation and tracking</p>
                      <p className="text-sm text-gray-500 mt-4">Full demo coming soon...</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeSection === 3 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Challenges & Solutions</h1>
                
                <div className="space-y-6">
                  {project.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="glass p-6 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">⚡</div>
                        <p className="text-gray-300">{challenge}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {id === 'careerhub' && (
          <>
            {activeSection === 0 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Overview</h1>
                <p className="text-lg text-gray-300 mb-8">{project.overview.description}</p>

                <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {project.overview.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.overview.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 1 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Features</h1>
                
                <div className="space-y-8">
                  {Object.entries(project.features).map(([key, feature], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="glass p-8 rounded-lg"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400 mb-6">{feature.description}</p>
                      
                      <div className="space-y-3">
                        {feature.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-gray-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 2 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Demo</h1>
                
                <div className="glass p-8 rounded-lg">
                  <div className="flex gap-4 mb-8 border-b border-white/10">
                    <button className="px-4 py-2 text-accent border-b-2 border-accent">
                      ATS Checker
                    </button>
                    <button className="px-4 py-2 text-gray-400">
                      Resume Builder
                    </button>
                    <button className="px-4 py-2 text-gray-400">
                      Job Tracker
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
                      <p className="text-gray-400 mb-4">Upload your resume (PDF)</p>
                      <button className="px-6 py-3 bg-accent/20 text-accent rounded-lg border border-accent/50">
                        Choose File
                      </button>
                    </div>

                    <div className="glass p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-4">Sample Results</h4>
                      <div className="space-y-3 text-gray-300">
                        <p>📊 ATS Score: 85/100</p>
                        <p>✅ Format: Compatible</p>
                        <p>🔍 Keywords: 12/15 matched</p>
                        <p>💡 Suggestions: 3 improvements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 3 && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-6">Tech Stack</h1>
                
                <div className="space-y-6">
                  {project.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="glass p-6 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">⚡</div>
                        <p className="text-gray-300">{challenge}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.main>
    </div>
  );
};

export default ProjectDetail;
