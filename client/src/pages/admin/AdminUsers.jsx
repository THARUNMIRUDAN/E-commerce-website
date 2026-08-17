import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Shield, ShieldAlert, CheckCircle, Ban, Calendar } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { adminService } from '../../services/adminService.js';
import { formatDate } from '../../utils/formatDate.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        keyword,
        role: roleFilter,
        page,
        limit: 10,
      });
      setUsers(res.users || []);
      setPages(res.pages || 1);
      setTotalUsers(res.totalUsers || 0);
    } catch (error) {
      console.error('[AdminUsers] Error:', error.message);
      showToast('Error loading user directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [keyword, roleFilter, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.message || 'Failed to update user role', 'error');
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await adminService.toggleBlockUser(userId);
      showToast(res.message, res.isBlocked ? 'info' : 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.message || 'Failed to update user status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Directory of registered customer and staff accounts ({totalUsers} users).
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-main)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={18}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="form-select"
          style={{ width: 'auto' }}
        >
          <option value="all">All Roles</option>
          <option value="USER">Customer (USER)</option>
          <option value="ADMIN">Administrator (ADMIN)</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-main)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {loading ? (
          <Loader message="Fetching users..." />
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No users found matching your search.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-main)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>User Profile</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Contact</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Joined Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Role Authority</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Account Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {u.phone || 'No phone provided'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-light)" />
                        <span>{formatDate(u.createdAt)}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={u.role}
                        disabled={u.email === 'admin@revibe.com'}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="form-select"
                        style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          width: 'auto',
                        }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        className={`badge ${u.isBlocked ? 'badge-warning' : 'badge-success'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {u.isBlocked ? (
                          <>
                            <Ban size={12} /> Suspended
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} /> Active
                          </>
                        )}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {u.email !== 'admin@revibe.com' && (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`btn ${u.isBlocked ? 'btn-outline' : 'btn-danger'} btn-sm`}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '1rem' }}>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
