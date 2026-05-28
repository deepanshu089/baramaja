'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Plus, Edit2, Trash2, Star, FolderEdit } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function ProductsPage() {
  const { refreshProducts } = useShop();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('odisha');

  // Category Manager Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null); // null means "Add Mode"
  const [catFormData, setCatFormData] = useState({ 
    displayName: '', 
    slug: '', 
    sortOrder: 0,
    odishaTitle: '',
    odishaSubtitle: '',
    kolkataTitle: '',
    kolkataSubtitle: ''
  });
  const [catSubmitting, setCatSubmitting] = useState(false);

  const fetchProductsAndData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, regRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/regions/admin/all'),
        api.get('/categories')
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (regRes.success) setRegions(regRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndData();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      await api.patch(`/products/${id}/toggle-featured`);
      await fetchProductsAndData();
      refreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProductsAndData();
      refreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddForm = () => {
    setFormData({
      name: '',
      description: '',
      region: regions[0]?._id || '',
      category: categories[0]?._id || '',
      image: '',
      price: 0,
      discountPrice: 0,
      weight: '',
      tags: '',
      featured: false
    });
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setFormData({
      ...product,
      region: product.region?._id || product.region,
      category: product.category?._id || product.category,
      tags: product.tags?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      };

      if (payload._id) {
        await api.put(`/products/${payload._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      await fetchProductsAndData();
      refreshProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Category CRUD Handlers
  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCatFormData({
      displayName: cat.displayName || '',
      slug: cat.slug || '',
      sortOrder: cat.sortOrder || 0,
      odishaTitle: cat.odishaTitle || '',
      odishaSubtitle: cat.odishaSubtitle || '',
      kolkataTitle: cat.kolkataTitle || '',
      kolkataSubtitle: cat.kolkataSubtitle || ''
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCatFormData({ 
      displayName: '', 
      slug: '', 
      sortOrder: 0,
      odishaTitle: '',
      odishaSubtitle: '',
      kolkataTitle: '',
      kolkataSubtitle: ''
    });
  };

  const handleDisplayNameChange = (val: string) => {
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setCatFormData({ ...catFormData, displayName: val, slug: generatedSlug });
    } else {
      setCatFormData({ ...catFormData, displayName: val });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatSubmitting(true);
    try {
      const activeRegionObj = regions.find((r) => r.slug === activeTab);
      const payload = {
        ...catFormData,
        region: editingCategory
          ? (editingCategory.region?._id || editingCategory.region)
          : activeRegionObj?._id,
      };

      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, payload);
        if (res.success) {
          alert('Category updated successfully!');
          resetCategoryForm();
        } else {
          alert(res.message || 'Failed to update category');
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.success) {
          alert('Category created successfully!');
          resetCategoryForm();
        } else {
          alert(res.message || 'Failed to create category');
        }
      }
      await fetchProductsAndData();
      refreshProducts();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.success) {
        alert('Category deleted successfully!');
        if (editingCategory?._id === id) {
          resetCategoryForm();
        }
        await fetchProductsAndData();
        refreshProducts();
      } else {
        alert(res.message || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  // Get categories for active region (sorted by sortOrder)
  const activeRegionCategories = categories
    .filter((c: any) => (c.region?.slug || c.region) === activeTab)
    .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Get products for active region, keyed by category id
  const activeRegionProducts = products.filter(
    (p: any) => (p.region?.slug || 'odisha') === activeTab
  );

  // Group products by category
  const productsByCategory: Record<string, any[]> = {};
  activeRegionCategories.forEach((cat: any) => {
    productsByCategory[cat._id] = activeRegionProducts.filter(
      (p: any) => {
        const pCatSlug = p.category?.slug || '';
        return pCatSlug === cat.slug;
      }
    ).sort((a: any, b: any) => a.name.localeCompare(b.name));
  });

  // Products with no category match
  const uncategorized = activeRegionProducts.filter((p: any) => {
    return !activeRegionCategories.some((cat: any) => cat.slug === (p.category?.slug || ''));
  });

  const isOdisha = activeTab === 'odisha';
  const regionAccent = isOdisha ? 'bg-red-800' : 'bg-amber-800';
  const regionLight = isOdisha ? 'bg-red-50 text-red-800 border-red-100' : 'bg-amber-50 text-amber-800 border-amber-100';
  const regionBar = isOdisha ? 'from-red-800 to-red-600' : 'from-amber-800 to-amber-600';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Products</h2>
          <p className="text-stone-500 text-sm">Manage your inventory across all regions.</p>
        </div>

        <div className="flex bg-amber-100/50 border border-amber-200/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('odisha')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'odisha' ? 'bg-red-800 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Odisha
          </button>
          <button
            onClick={() => setActiveTab('kolkata')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'kolkata' ? 'bg-amber-900 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Kolkata
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors border border-stone-200/50"
          >
            <FolderEdit size={16} />
            <span>Manage Categories</span>
          </button>

          <button 
            onClick={openAddForm}
            className="flex items-center space-x-2 bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-amber-800 transition-colors"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {showForm && formData && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm !mt-0">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            {/* Left side: Image Preview & Upload */}
            <div className="md:w-2/5 bg-stone-50 border-r border-stone-100 flex flex-col relative">
              {formData.image ? (
                <img src={formData.image} alt="Product Preview" className="w-full h-48 md:h-full object-cover" />
              ) : (
                <div className="w-full h-48 md:h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <span className="font-serif-editorial text-2xl">?</span>
                  </div>
                  <p className="text-sm font-bold">No Image Selected</p>
                  <p className="text-xs mt-1">Upload a JPG or PNG</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <label className="cursor-pointer block w-full bg-white/90 hover:bg-white text-stone-900 text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm">
                  {formData.image ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="mt-3">
                   <p className="text-[10px] text-white/70 uppercase font-bold text-center mb-1">OR ENTER URL</p>
                   <input type="url" placeholder="https://" value={formData.image.startsWith('http') ? formData.image : ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-white/20 bg-black/30 rounded-lg text-xs text-white placeholder:text-white/40 focus:border-white focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Right side: Form Fields */}
            <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto text-left">
              <h3 className="text-2xl font-serif-editorial font-bold text-stone-800 mb-6">
                {formData._id ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-500 mb-1">Product Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Region *</label>
                    <select
                      required
                      value={formData.region}
                      onChange={(e) => {
                        const newRegId = e.target.value;
                        const newRegSlug = regions.find((r) => r._id === newRegId)?.slug || '';
                        const firstAllowed = categories.find(
                          (c) => (c.region?.slug || '') === newRegSlug
                        )?._id || '';
                        setFormData({ ...formData, region: newRegId, category: firstAllowed });
                      }}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none bg-white text-stone-900"
                    >
                      <option value="" className="text-stone-500">Select Region</option>
                      {regions.map((r) => (
                        <option key={r._id} value={r._id} className="text-stone-900">
                          {r.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none bg-white text-stone-900"
                    >
                      <option value="" className="text-stone-500">Select Category</option>
                      {categories
                        .filter((c) => {
                          const regSlug = regions.find((r) => r._id === formData.region)?.slug || '';
                          return (c.region?.slug || '') === regSlug;
                        })
                        .map((c) => (
                          <option key={c._id} value={c._id} className="text-stone-900">
                            {c.displayName || c.slug}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Original Price (₹) *</label>
                    <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Discount Price (₹) *</label>
                    <input type="number" required min="0" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-600 mb-1">Weight Specification * (Mandatory kg/g)</label>
                    <input type="text" required placeholder="e.g. 500g, 1kg" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Tags (comma separated)</label>
                    <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Description *</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:border-amber-500 focus:outline-none resize-none" />
                </div>

                <div className="flex items-center space-x-2 pt-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-amber-600 accent-amber-600" />
                  <label htmlFor="featured" className="text-sm font-bold text-stone-700 cursor-pointer">Feature on Homepage</label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-stone-100">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-amber-900 text-amber-50 font-bold text-sm hover:bg-amber-950 disabled:opacity-50 transition-colors shadow-md">
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm !mt-0">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between shadow-md">
              <div>
                <h3 className="font-serif-editorial text-lg font-bold">Manage Categories</h3>
                <p className="text-[11px] text-stone-300">Create, edit, or delete catalog categories across your marketplace.</p>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  resetCategoryForm();
                }}
                className="text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Side: Category List */}
              <div className="md:w-1/2 p-6 overflow-y-auto border-r border-stone-100 flex flex-col min-h-0">
                {(() => {
                  const activeRegionObj = regions.find((r) => r.slug === activeTab);
                  const activeRegionCategories = categories.filter(
                    (c) => (c.region?.slug || c.region) === activeTab
                  );
                  return (
                    <>
                      <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 text-left">
                        {activeTab === 'odisha' ? 'Odisha' : 'Kolkata'} Categories ({activeRegionCategories.length})
                      </h4>
                      <div className="flex-1 overflow-y-auto border border-stone-100 rounded-2xl bg-stone-50/30 divide-y divide-stone-100">
                        {activeRegionCategories.length === 0 ? (
                          <div className="p-8 text-center text-stone-400 text-xs font-semibold">
                            No categories found for {activeTab === 'odisha' ? 'Odisha' : 'Kolkata'}. Create one on the right!
                          </div>
                        ) : (
                          activeRegionCategories.map((cat) => (
                            <div key={cat._id} className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left">
                              <div className="space-y-1">
                                <p className="text-xs font-extrabold text-stone-900">{cat.displayName}</p>
                                <p className="text-[10px] text-stone-400 font-semibold leading-normal">
                                  Slug: <span className="text-stone-600 font-mono">{cat.slug}</span> • Order: {cat.sortOrder || 0}
                                </p>
                                {(cat.odishaTitle || cat.kolkataTitle) && (
                                  <div className="text-[9px] text-stone-500 font-semibold bg-stone-100 p-1.5 rounded space-y-0.5 mt-1 border border-stone-200/50">
                                    {cat.odishaTitle && <div><span className="text-red-800 font-extrabold">OD:</span> {cat.odishaTitle} ({cat.odishaSubtitle || 'no tag'})</div>}
                                    {cat.kolkataTitle && <div><span className="text-amber-800 font-extrabold">KO:</span> {cat.kolkataTitle} ({cat.kolkataSubtitle || 'no tag'})</div>}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-1.5 self-start">
                                <button
                                  onClick={() => handleEditCategory(cat)}
                                  className="p-1.5 text-stone-400 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Edit Category"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat._id)}
                                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Category"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Right Side: Add / Edit Form */}
              <div className="md:w-1/2 p-6 bg-stone-50/50 flex flex-col justify-between overflow-y-auto text-left">
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">
                      {editingCategory ? 'Edit Category' : 'Create Category'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">Display Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sweets"
                            value={catFormData.displayName}
                            onChange={(e) => handleDisplayNameChange(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">Sort Order *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={catFormData.sortOrder}
                            onChange={(e) => setCatFormData({ ...catFormData, sortOrder: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">Category Slug *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. sweets"
                          value={catFormData.slug}
                          onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          className="w-full px-3 py-2 border border-stone-200 bg-white rounded-lg text-xs font-mono focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Odisha Specific Regional Details */}
                      {activeTab === 'odisha' && (
                        <div className="p-3 bg-red-50/40 border border-red-100 rounded-xl space-y-3 animate-fadeIn">
                          <p className="text-[10px] font-black uppercase tracking-wider text-red-900">Odisha Marketplace Customization</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Odisha Heading</label>
                              <input
                                type="text"
                                placeholder="e.g. Traditional Odia Sweets"
                                value={catFormData.odishaTitle}
                                onChange={(e) => setCatFormData({ ...catFormData, odishaTitle: e.target.value })}
                                className="w-full px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Odisha Tag / Subtitle</label>
                              <input
                                type="text"
                                placeholder="e.g. SWEET TREASURES"
                                value={catFormData.odishaSubtitle}
                                onChange={(e) => setCatFormData({ ...catFormData, odishaSubtitle: e.target.value })}
                                className="w-full px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Kolkata Specific Regional Details */}
                      {activeTab === 'kolkata' && (
                        <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-3 animate-fadeIn">
                          <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">Kolkata Marketplace Customization</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Kolkata Heading</label>
                              <input
                                type="text"
                                placeholder="e.g. Kolkata Signature Mishti"
                                value={catFormData.kolkataTitle}
                                onChange={(e) => setCatFormData({ ...catFormData, kolkataTitle: e.target.value })}
                                className="w-full px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Kolkata Tag / Subtitle</label>
                              <input
                                type="text"
                                placeholder="e.g. SWEET TREASURES"
                                value={catFormData.kolkataSubtitle}
                                onChange={(e) => setCatFormData({ ...catFormData, kolkataSubtitle: e.target.value })}
                                className="w-full px-3 py-1.5 border border-stone-200 bg-white rounded-lg text-xs font-medium focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col space-y-2 border-t border-stone-200/50">
                    <button
                      type="submit"
                      disabled={catSubmitting}
                      className="w-full py-2 bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50"
                    >
                      {catSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                    </button>
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
                
                <div className="mt-6 text-[10px] text-stone-400 font-medium leading-relaxed">
                  ⚠️ Deleting a category will fail if there are products currently assigned to it to prevent broken catalog links.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-amber-800 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeRegionCategories.map((cat: any) => {
            const catProducts = productsByCategory[cat._id] || [];
            if (catProducts.length === 0) return null;
            return (
              <div key={cat._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                {/* Category Header */}
                <div className={`px-5 py-3.5 ${regionAccent} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-5 bg-white/40 rounded-full" />
                    <div>
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                        {activeTab === 'odisha'
                          ? (cat.odishaTitle || cat.displayName)
                          : (cat.kolkataTitle || cat.displayName)}
                      </h3>
                      {(activeTab === 'odisha' ? cat.odishaSubtitle : cat.kolkataSubtitle) && (
                        <p className="text-[10px] text-white/60 font-semibold mt-0.5">
                          {activeTab === 'odisha' ? cat.odishaSubtitle : cat.kolkataSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {catProducts.length} products
                  </span>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {catProducts.map((product: any) => (
                        <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                              />
                              <div className="text-left">
                                <p className="font-bold text-stone-800 text-sm leading-tight">{product.name}</p>
                                <p className="text-stone-400 text-[11px] mt-0.5 font-semibold">{product.weight}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-stone-800">₹{product.discountPrice}</span>
                              {product.price > product.discountPrice && (
                                <span className="text-stone-400 line-through text-xs">₹{product.price}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleToggleFeatured(product._id)}
                              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                                product.featured
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                              }`}
                              title="Toggle Featured"
                            >
                              <Star size={11} className={product.featured ? 'fill-amber-700' : ''} />
                              <span>{product.featured ? 'Featured' : 'Standard'}</span>
                            </button>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => openEditForm(product)}
                                className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Uncategorized products */}
          {uncategorized.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-5 py-3.5 bg-stone-700 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Uncategorized</h3>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{uncategorized.length} products</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {uncategorized.map((product: any) => (
                      <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-stone-800 text-sm">{product.name}</p>
                              <p className="text-stone-400 text-[11px] mt-0.5 font-semibold">{product.weight}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-extrabold text-stone-800">₹{product.discountPrice}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleToggleFeatured(product._id)}
                            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              product.featured ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            <Star size={11} className={product.featured ? 'fill-amber-700' : ''} />
                            <span>{product.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button onClick={() => openEditForm(product)} className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeRegionCategories.every((cat: any) => (productsByCategory[cat._id] || []).length === 0) && uncategorized.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
              <p className="text-stone-400 text-sm font-semibold">No products found for {activeTab === 'odisha' ? 'Odisha' : 'Kolkata'}.</p>
              <button onClick={openAddForm} className="mt-4 px-5 py-2 bg-amber-900 text-white text-xs font-bold rounded-xl hover:bg-amber-800 transition-colors">
                Add First Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
