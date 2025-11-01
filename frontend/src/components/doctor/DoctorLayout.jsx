import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DoctorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/doctor/profile', label: 'My Profile', icon: '👤' },
    { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
    { path: '/doctor/treatments', label: 'Treatments', icon: '💊' },
    { path: '/doctor/patients', label: 'Search Patients', icon: '🔍' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '250px' : '70px',
          backgroundColor: '#27ae60',
          color: 'white',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #229954' }}>
          <h2 style={{ margin: 0, fontSize: sidebarOpen ? '20px' : '16px', whiteSpace: 'nowrap' }}>
            {sidebarOpen ? '👨‍⚕️ Doctor Panel' : '👨‍⚕️'}
          </h2>
        </div>

        <nav style={{ flex: 1, padding: '10px 0' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                color: isActive(item.path) ? '#2ecc71' : 'white',
                textDecoration: 'none',
                backgroundColor: isActive(item.path) ? '#229954' : 'transparent',
                borderLeft: isActive(item.path) ? '4px solid #2ecc71' : '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = '#229954';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '20px', marginRight: sidebarOpen ? '15px' : '0', minWidth: '25px' }}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #229954' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', opacity: 0.8 }}>
            {sidebarOpen && `Logged in as: ${user?.fullName || user?.username}`}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '250px' : '70px',
          flex: 1,
          transition: 'margin-left 0.3s',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px 15px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DoctorLayout;

