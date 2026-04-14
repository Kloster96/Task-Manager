import React, { useContext, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Input from '../../components/Inputs/Input';
import ProfilePhotosSelector from '../../components/Inputs/ProfilePhotosSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (file) => {
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let profileImageUrl = user?.profileImageUrl;

      // Si hay nueva imagen, subirla a Cloudinary
      if (profilePic) {
        const uploadRes = await uploadImage(profilePic);
        profileImageUrl = uploadRes?.imageUrl || user?.profileImageUrl;
      }

      // Actualizar perfil
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name,
        email,
        profileImageUrl,
      });

      // Actualizar contexto con los nuevos datos
      updateUserData(response.data);
      
      toast.success('Perfil actualizado correctamente');
      
      // Redireccionar según rol
      setTimeout(() => {
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Perfil">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Editar Perfil
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={previewImage || 'https://via.placeholder.com/150'}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                />
              </div>
              <label className="mt-3 cursor-pointer text-primary hover:text-primary-dark text-sm font-medium">
                Cambiar foto de perfil
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
              </label>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                value={name}
                onChange={({ target }) => setName(target.value)}
                type="text"
              />
              
              <Input
                label="Email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                type="email"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;