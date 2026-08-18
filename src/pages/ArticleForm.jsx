import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../services/articlesService.js';
import { deleteArticleImageByUrl, uploadArticleImage, validateImageFile } from '../services/storageService.js';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY = { title: '', excerpt: '', category: 'Technology', readTime: '4 min', imageUrl: '', byline: '' };

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [savingStage, setSavingStage] = useState(''); 
  const [error, setError] = useState('');

  // Image upload state
  const fileInputRef = useRef(null);
  const originalImageUrl = useRef(''); 
  const [imageFile, setImageFile] = useState(null); 
  const [imageRemoved, setImageRemoved] = useState(false); 
  const [imageError, setImageError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getArticle(id).then((data) => {
      if (!data) {
        setLoading(false);
        return;
      }
      if (data.authorId !== user?.uid) {
        
        navigate('/dashboard', { replace: true });
        return;
      }
      setForm(data);
      originalImageUrl.current = data.imageUrl || '';
      setLoading(false);
    });
  }, [id, isEdit, user, navigate]);

 
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(!imageRemoved && form.imageUrl ? form.imageUrl : '');
  }, [imageFile, imageRemoved, form.imageUrl]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      e.target.value = '';
      return;
    }
    setImageError('');
    setImageFile(file);
    setImageRemoved(false);
    e.target.value = ''; 
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImageRemoved(true);
    setImageError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (imageFile) {
      const validationError = validateImageFile(imageFile);
      if (validationError) {
        setImageError(validationError);
        return;
      }
    }

    setSaving(true);
    let uploadedUrl = null;

    try {
      let nextImageUrl = imageRemoved ? '' : form.imageUrl;

      if (imageFile) {
        setSavingStage('uploading');
        uploadedUrl = await uploadArticleImage(imageFile, user?.uid);
        nextImageUrl = uploadedUrl;
      }

      setSavingStage('saving');
      const payload = { ...form, imageUrl: nextImageUrl };

      if (isEdit) {
        await updateArticle(id, payload);
      } else {
        await createArticle(payload, user?.uid);
      }

      
      const oldUrl = originalImageUrl.current;
      if (oldUrl && oldUrl !== nextImageUrl) {
        deleteArticleImageByUrl(oldUrl);
      }

      navigate('/dashboard');
    } catch (err) {
      
      if (uploadedUrl) {
        deleteArticleImageByUrl(uploadedUrl);
      }
      setError('Could not save the story. Please try again.');
    } finally {
      setSaving(false);
      setSavingStage('');
    }
  }

  if (loading) {
    return (
      <main id="main">
        <section className="page-intro container"><p className="dek">Loading…</p></section>
      </main>
    );
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Dashboard</span>
        <h2>{isEdit ? 'Edit Story' : 'New Story'}</h2>
      </section>

      <section className="block">
        <div className="container auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea id="excerpt" required value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {['Technology', 'World', 'Business', 'Sport', 'Culture', 'Health'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="readTime">Read time</label>
              <input id="readTime" value={form.readTime} onChange={(e) => update('readTime', e.target.value)} placeholder="4 min" />
            </div>

            <div className="form-field">
              <label htmlFor="image">{isEdit ? 'Current Image' : 'Upload Image'}</label>

              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/jpeg,image/png,image/webp"
                className="image-upload-input"
                onChange={handleFileChange}
              />

              <div className="image-upload-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? 'Choose Another Image' : 'Choose Image'}
                </button>
                {previewUrl && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleRemoveImage}>
                    Remove Image
                  </button>
                )}
              </div>

              {previewUrl && (
                <div className="image-upload-preview">
                  <img src={previewUrl} alt="Story preview" />
                </div>
              )}
              {imageFile && <p className="image-upload-filename">{imageFile.name}</p>}

              {imageError && <p className="form-note form-note-error">{imageError}</p>}
              {savingStage === 'uploading' && <p className="form-note">Uploading image…</p>}
            </div>

            <div className="form-field">
              <label htmlFor="byline">Byline</label>
              <input id="byline" value={form.byline} onChange={(e) => update('byline', e.target.value)} placeholder="By Sothea Ly" />
            </div>

            {error && <p className="form-note form-note-error">{error}</p>}

            <button type="submit" className="btn" disabled={saving}>
              {savingStage === 'uploading'
                ? 'Uploading image…'
                : savingStage === 'saving'
                ? (isEdit ? 'Saving…' : 'Publishing…')
                : isEdit ? 'Save Changes' : 'Publish Story'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
