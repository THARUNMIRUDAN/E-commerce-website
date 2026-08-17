import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import { categoryService } from '../../services/categoryService.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('[AdminCategories] Error:', error.message);
      showToast('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setImage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setModalOpen(true);
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await categoryService.delete(id);
      showToast('Category deleted successfully', 'info');
      fetchCategories();
    } catch (error) {
      showToast(error.message || 'Failed to delete category', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingCat) {
        await categoryService.update(editingCat._id, { name, description, image });
        showToast('Category updated!', 'success');
      } else {
        await categoryService.create({ name, description, image });
        showToast('Category created!', 'success');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      showToast(error.message || 'Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Categories Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Organize products into curated departments and visual showcases.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-accent btn-md">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <Loader message="Loading categories..." />
      ) : categories.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No categories found.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-main)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '140px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {cat.productCount || 0} Products
                </span>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                  {cat.description || 'No description provided'}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button onClick={() => handleOpenEdit(cat)} className="btn btn-outline btn-sm">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800 }}>
                {editingCat ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Footwear"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of items in this category"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline btn-md">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-md">
                  {saving ? 'Saving...' : editingCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
