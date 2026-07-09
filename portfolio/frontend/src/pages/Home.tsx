import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    id: 'aldorado-jewells',
    name: 'Aldorado Jewells',
    description: 'E-commerce platform for jewelry with advanced cart and payment flow',
    tech: ['React', 'Node.js', 'Supabase', 'Stripe'],
    gradient: 'from-primary to-purple-900',
  },
  {
    id: 'careerhub',
    name: 'CareerHub',
    description: 'ATS Resume Checker + Resume Builder + Job Application Tracker',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    gradient: 'from-accent to-orange-900',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sreshtha Saxena
            </span>
          </h1>
          <p className="text-2xl text-gray-400 mb-2">
            Project Manager + Full Stack Developer
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>React</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>Supabase</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Project Playground
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => navigate(`/project/${project.id}`)}
              className="glass rounded-2xl p-8 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-gray-400 mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-primary group-hover:text-accent transition-colors">
                  <span className="font-semibold">Explore Project</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate('/contact')}
            className="glass px-8 py-3 rounded-lg font-semibold text-white border border-accent/50 hover:border-accent transition-all glow-gold"
          >
            Let's Build Something Together
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
