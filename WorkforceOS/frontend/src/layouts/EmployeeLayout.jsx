import { Outlet } from 'react-router-dom';

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Employee Portal</h1>
        <p className="text-gray-600 mb-8">Employee layout - implement following CandidateLayout pattern</p>
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
