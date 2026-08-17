import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: '2.5rem',
          overflowY: 'auto',
          maxWidth: 'calc(100vw - 260px)',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
