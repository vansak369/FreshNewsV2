import React, { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext.jsx';
import { useScrollMemory } from '../hooks/useScrollMemory.js';
import {
  deleteProfileImageByUrl,
  uploadProfileImage,
  validateImageFile,
} from '../services/storageService.js';

export default function Profile() {
  const { user } = useAuth();
  useScrollMemory('profile');

  const [name, setName] = useState(user?.displayName || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState(''); 
  const [savingStage, setSavingStage] = useState(''); 

  const fileInputRef = useRef(null);
  const originalPhotoUrl = useRef(user?.photoURL || '');
  const [imageFile, setImageFile] = useState(null); 
  const [imageRemoved, setImageRemoved] = useState(false); 
  const [imageError, setImageError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || '');

 
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(!imageRemoved && photoUrl ? photoUrl : '');
  }, [imageFile, imageRemoved, photoUrl]);

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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(''); 
  const [passwordError, setPasswordError] = useState('');

  async function handleProfileSubmit(e) {
    e.preventDefault();

    if (imageFile) {
      const validationError = validateImageFile(imageFile);
      if (validationError) {
        setImageError(validationError);
        return;
      }
    }

    setSavingProfile(true);
    setProfileStatus('');
    let uploadedUrl = null;

    try {
      let nextPhotoUrl = imageRemoved ? '' : photoUrl;

      if (imageFile) {
        setSavingStage('uploading');
        uploadedUrl = await uploadProfileImage(imageFile, user?.uid);
        nextPhotoUrl = uploadedUrl;
      }

      setSavingStage('saving');
      await updateProfile(user, { displayName: name, photoURL: nextPhotoUrl });

     
      const oldUrl = originalPhotoUrl.current;
      if (oldUrl && oldUrl !== nextPhotoUrl) {
        deleteProfileImageByUrl(oldUrl);
      }

      setPhotoUrl(nextPhotoUrl);
      originalPhotoUrl.current = nextPhotoUrl;
      setImageFile(null);
      setImageRemoved(false);
      setProfileStatus('saved');
    } catch (err) {
      
      if (uploadedUrl) {
        deleteProfileImageByUrl(uploadedUrl);
      }
      setProfileStatus('error');
    } finally {
      setSavingProfile(false);
      setSavingStage('');
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordStatus('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordStatus('saved');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect.');
      } else {
        setPasswordError('Could not update your password. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Account</span>
        <h2>Your Profile</h2>
        <p className="lead">Update how your name and photo appear on Fresh News, or change your password.</p>
      </section>

      <section className="block">
        <div className="container auth-container">

          <div className="profile-avatar-row">
            {previewUrl ? (
              <img className="profile-avatar" src={previewUrl} alt={name || 'Profile photo'} />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder">
                {(name || user?.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4>{name || 'No name set'}</h4>
              <span className="byline">{user?.email}</span>
            </div>
          </div>

          <div className="section-head" style={{ marginTop: 36 }}>
            <h3>Profile Details</h3>
          </div>
          <form className="auth-form" onSubmit={handleProfileSubmit}>
            <div className="form-field">
              <label htmlFor="name">Display name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="image">Profile Photo</label>

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

              {imageFile && <p className="image-upload-filename">{imageFile.name}</p>}

              {imageError && <p className="form-note form-note-error">{imageError}</p>}
              {savingStage === 'uploading' && <p className="form-note">Uploading image…</p>}
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" value={user?.email || ''} disabled />
            </div>

            {profileStatus === 'saved' && <p className="form-note">Profile updated.</p>}
            {profileStatus === 'error' && <p className="form-note form-note-error">Could not save changes. Please try again.</p>}

            <button type="submit" className="btn" disabled={savingProfile}>
              {savingStage === 'uploading'
                ? 'Uploading image…'
                : savingStage === 'saving'
                ? 'Saving…'
                : 'Save Profile'}
            </button>
          </form>

          <div className="section-head" style={{ marginTop: 44 }}>
            <h3>Change Password</h3>
          </div>
          <form className="auth-form" onSubmit={handlePasswordSubmit}>
            <div className="form-field">
              <label htmlFor="currentPassword">Current password</label>
              <input
                type="password" id="currentPassword" autoComplete="current-password"
                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
              />
            </div>
            <div className="form-field">
              <label htmlFor="newPassword">New password</label>
              <input
                type="password" id="newPassword" autoComplete="new-password"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                type="password" id="confirmPassword" autoComplete="new-password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              />
            </div>

            {passwordError && <p className="form-note form-note-error">{passwordError}</p>}
            {passwordStatus === 'saved' && <p className="form-note">Password updated.</p>}

            <button type="submit" className="btn" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Update Password'}
            </button>
          </form>

        </div>
      </section>
    </main>
  );
}
