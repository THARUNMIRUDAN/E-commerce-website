import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Package } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: '',
    featured: false,
    specifications: [{ key: '', value: '' }],
  });

  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        productService.getAll({ keyword, page, limit: 10 }),
        categoryService.getAll(),
      ]);

      setProducts(prodData.products || []);
      setPages(prodData.pages || 1);
      setTotalProducts(prodData.totalProducts || 0);
      setCategories(catData || []);
    } catch (error) {
      console.error('[AdminProducts] Error:', error.message);
      showToast('Error loading catalog', 'error');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: categories[0]?._id || '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      images: '',
      featured: false,
      specifications: [{ key: '', value: '' }],
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category?._id || prod.category,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      images: (prod.images || []).join('\n'),
      featured: Boolean(prod.featured),
      specifications:
        prod.specifications && prod.specifications.length > 0
          ? prod.specifications
          : [{ key: '', value: '' }],
    });
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return;
    }
    try {
      await productService.delete(id);
      showToast('Product removed successfully', 'info');
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Failed to remove product', 'error');
    }
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const handleRemoveSpec = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }));
  };

  const handleSpecChange = (idx, field, val) => {
    const updated = [...formData.specifications];
    updated[idx][field] = val;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const imageList = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const validSpecs = formData.specifications.filter((s) => s.key.trim() && s.value.trim());

    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category || categories[0]?._id,
      description: formData.description,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      stock: Number(formData.stock),
      images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      featured: formData.featured,
      specifications: validSpecs,
    };

    try {
      setSaving(true);
      if (editingProduct) {
        await productService.update(editingProduct._id, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await productService.create(payload);
        showToast('New product created!', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
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
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Products Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage {totalProducts} inventory listings, pricing, and showcase flags.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-accent btn-md">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-main)',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Search by product name, brand, or model..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
        </div>
      </div>

      {/* Table Content */}
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
          <Loader message="Fetching products..." />
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No products found matching your search.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-main)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Product</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Price</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Stock</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                          alt={prod.name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{prod.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {prod.category?.name || 'General'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--primary-900)' }}>
                        {formatCurrency(prod.discountPrice > 0 ? prod.discountPrice : prod.price)}
                      </strong>
                      {prod.discountPrice > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through', display: 'block' }}>
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        className={`badge ${
                          prod.stock === 0 ? 'badge-warning' : prod.stock <= 5 ? 'badge-accent' : 'badge-success'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      {prod.featured && <span className="badge badge-primary">Featured</span>}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="btn-icon btn-ghost"
                          title="Edit product"
                          aria-label="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="btn-icon btn-ghost"
                          style={{ color: 'var(--rose-500)' }}
                          title="Delete product"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Inventory Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label className="form-label">Homepage Spotlight</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ accentColor: 'var(--primary-900)' }}
                    />
                    <span>Mark as Featured</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (One per line) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-textarea"
                />
              </div>

              {/* Specifications */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Specifications (Key - Value)</label>
                  <button type="button" onClick={handleAddSpec} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                    + Add Spec
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.specifications.map((spec, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Key (e.g. Battery Life)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        className="form-input"
                        style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 30 Hours)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="form-input"
                        style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--rose-500)', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline btn-md">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-md">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
