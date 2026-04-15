import React, { useEffect, useState } from 'react';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModifierBus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    immatriculation: '',
    modele: '',
    capacite: '',
    statut: 'disponible'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`http://localhost:3000/bus/${id}`)
      .then(res => {
        const bus = res.data;
        setFormData({
          immatriculation: bus.immatriculation || '',
          modele: bus.modele || '',
          capacite: bus.capacite || '',
          statut: bus.statut || 'disponible'
        });
      })
      .catch(err => {
        console.error('Erreur fetch bus:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger le bus' });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.immatriculation.trim()) newErrors.immatriculation = "L'immatriculation est requise";
    else if (!/^[A-Z0-9-]{7,12}$/.test(formData.immatriculation.trim().toUpperCase())) newErrors.immatriculation = 'Format invalide (ex: AB-123-CD)';
    if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis';
    if (!formData.capacite) newErrors.capacite = 'La capacité est requise';
    else if (isNaN(formData.capacite) || formData.capacite < 10 || formData.capacite > 80) newErrors.capacite = 'La capacité doit être entre 10 et 80 places';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      immatriculation: formData.immatriculation.trim().toUpperCase(),
      modele: formData.modele.trim(),
      capacite: Number(formData.capacite),
      statut: formData.statut
    };

    axios.put(`http://localhost:3000/bus/${id}`, payload)
      .then(res => {
        Swal.fire({ icon: 'success', title: 'Succès', text: res.data?.message || 'Bus mis à jour avec succès', timer: 1200, showConfirmButton: false })
          .then(() => navigate('/bus/ListeBus'));
      })
      .catch(err => {
        console.error('Erreur mise à jour:', err);
        setSubmitError(err.response?.data?.error || 'Erreur lors de la mise à jour');
      })
      .finally(() => setIsSubmitting(false));
  };

  if (loading) return <div className="p-6">Chargement du bus...</div>;

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Modifier un bus</h1>
                <p className="text-sm text-gray-500">Mettez à jour les informations</p>
              </div>
            </div>
          </div>

          {submitError && <div className="mb-4 text-red-600">{submitError}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Immatriculation <span className="text-red-500">*</span></label>
                <input type="text" name="immatriculation" value={formData.immatriculation} onChange={handleChange} className={`w-full px-3 py-2 border ${errors.immatriculation ? 'border-red-300' : 'border-gray-300'} rounded`} />
                {errors.immatriculation && <p className="mt-1 text-xs text-red-600">{errors.immatriculation}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Modèle <span className="text-red-500">*</span></label>
                <input type="text" name="modele" value={formData.modele} onChange={handleChange} className={`w-full px-3 py-2 border ${errors.modele ? 'border-red-300' : 'border-gray-300'} rounded`} />
                {errors.modele && <p className="mt-1 text-xs text-red-600">{errors.modele}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Capacité (places) <span className="text-red-500">*</span></label>
                <input type="number" name="capacite" value={formData.capacite} onChange={handleChange} min="10" max="80" className={`w-full px-3 py-2 border ${errors.capacite ? 'border-red-300' : 'border-gray-300'} rounded`} />
                {errors.capacite && <p className="mt-1 text-xs text-red-600">{errors.capacite}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded">
                  <option value="disponible">Disponible</option>
                  <option value="en voyage">En voyage</option>
                  <option value="en maintenance">En maintenance</option>
                  <option value="hors service">Hors service</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Link to="/bus/ListeBus" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 text-sm"><FaArrowLeft /> Retour</Link>
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" disabled={isSubmitting}>
                <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierBus;
