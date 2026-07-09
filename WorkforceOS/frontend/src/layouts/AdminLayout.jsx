import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <p className="text-gray-600 mb-8">Admin layout - implement following CandidateLayout pattern</p>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
