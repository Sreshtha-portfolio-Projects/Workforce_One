const AuthBrandPanel = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 relative overflow-hidden">
      <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold">WorkforceOS</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Your future<br />
            starts <span className="text-yellow-400">here</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-md mx-auto">
            Explore opportunities, grow your skills, and build a career with us.
          </p>
        </div>

        <div className="relative w-full max-w-md h-64 flex items-center justify-center">
          <div className="flex gap-8 items-end">
            <div className="w-24 h-32 bg-blue-700 rounded-t-full opacity-80" />
            <div className="w-24 h-36 bg-blue-600 rounded-t-full opacity-90" />
            <div className="w-24 h-32 bg-blue-700 rounded-t-full opacity-80" />
          </div>
        </div>

        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-3 flex-wrap px-8">
          {['Latest Job Openings', 'Internship for students', 'Track your application', 'Career Resource'].map((item) => (
            <div key={item} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl" />
      </div>
    </div>
  );
};

export default AuthBrandPanel;
