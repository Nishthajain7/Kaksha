import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import BlockIcon from '@mui/icons-material/Block';


export default function Sidebar() {
  const [activeItem, setActiveItem] = React.useState('Dashboard');

  const navItems = [
    { title: 'Dashboard', icon: DashboardIcon },
    { title: 'Upload', icon: PersonIcon },
    { title: 'Quizzes', icon: ShoppingCartIcon, badge: '+3' },
    { title: 'Log out', icon: LockIcon },
  ];

  return (
    <div style={{
      width: 280,
      height: '100vh',
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      padding: 16,
    }}>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* Replace with our logo */}
          
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 24,
              height: 24,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 6,
            }} />
          </div>

          <span style={{ color: '#212121', fontSize: 14, fontWeight: 600 }}>Nishtha Jain</span>
          {/* <span style={{
            color: '#757575',
            fontSize: 12,
            backgroundColor: '#f5f5f5',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 500,
          }}>Free</span> */}
        </div>
      </div>

      <nav style={{ flex: 1, overflow: 'auto' }}>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          {navItems.map((item) => {
            const isActive = item.title === activeItem;
            const IconComponent = item.icon;

            return (
              <li key={item.title} style={{ padding: 0 }}>
                <button
                  onClick={() => setActiveItem(item.title)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      opacity: isActive ? 1 : 0.6,
                    }}>
                      <IconComponent />
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: '#ffe0b2',
                      color: '#e65100',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 8,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>xx
    </div>
  );
}