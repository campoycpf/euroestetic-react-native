'use client'
import { User } from "@/payload-types";
import { FaPencilAlt, FaKey, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { PROVINCES, Province } from 'utils/consts';
import { updateUserShippingData, updateUserBillingData } from "../checkout/checkoutActions";
import { UserShippingForm, UserBillingForm } from "../checkout/types";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import { validateCifDniNie, validateCP } from 'utils/validations'


const UserDataDashboard = ({ user: initialUser }: { user: User }) => {
  const { setJWTUser } = useCartStore();
  const [user, setUser] = useState<User>(initialUser);

  // Estados para Datos de Usuario/Envío
  const [isEditingUserShippingData, setIsEditingUserShippingData] = useState(false);
  const [formDataShipping, setFormDataShipping] = useState<UserShippingForm>({
    name: initialUser.name || '',
    email: initialUser.email || '', // Aunque el email no se edita aquí, lo mantenemos por coherencia con UserShippingForm
    address: initialUser.address || '',
    city: initialUser.city || '',
    cp: initialUser.cp || '',
    province: initialUser.province || '',
  });
  const [formShippingErrors, setFormShippingErrors] = useState<Partial<UserShippingForm>>({});

  // Estados para Datos de Facturación
  const [isEditingUserBillingData, setIsEditingUserBillingData] = useState(false);
  const [formDataBilling, setFormDataBilling] = useState<UserBillingForm>({
    cif_dni_nie: initialUser.cif_dni_nie || '',
    mailing_name: initialUser.mailing_name || initialUser.name || '',
    mailing_address: initialUser.mailing_address || initialUser.address || '',
    mailing_city: initialUser.mailing_city || initialUser.city || '',
    mailing_cp: initialUser.mailing_cp || initialUser.cp || '',
    mailing_province: initialUser.mailing_province || initialUser.province || '',
  });
  const [formBillingErrors, setFormBillingErrors] = useState<Partial<UserBillingForm>>({});


  useEffect(() => {
    setUser(initialUser);
    // Resetear datos de envío
    setFormDataShipping({
      name: initialUser.name || '',
      email: initialUser.email || '',
      address: initialUser.address || '',
      city: initialUser.city || '',
      cp: initialUser.cp || '',
      province: initialUser.province || '',
    });
    // Resetear datos de facturación
    setFormDataBilling({
      cif_dni_nie: initialUser.cif_dni_nie || '',
      mailing_name: initialUser.mailing_name || initialUser.name || '',
      mailing_address: initialUser.mailing_address || initialUser.address || '',
      mailing_city: initialUser.mailing_city || initialUser.city || '',
      mailing_cp: initialUser.mailing_cp || initialUser.cp || '',
      mailing_province: initialUser.mailing_province || initialUser.province || '',
    });
  }, [initialUser]);
  
  const handleEditEmail = () => {
    // Aquí iría la lógica para abrir un modal o formulario de edición de email
  };

  const handleChangePassword = () => {
    // Aquí iría la lógica para el proceso de cambio de contraseña
  };

  const toggleEditUserData = () => {
    const newEditingState = !isEditingUserShippingData;
    if (newEditingState) { // Si vamos a abrir el form de envío
      setIsEditingUserBillingData(false); // Cerramos el de facturación
      setFormDataBilling({ // Reseteamos datos de facturación por si acaso
        cif_dni_nie: user.cif_dni_nie || '',
        mailing_name: user.mailing_name || user.name || '',
        mailing_address: user.mailing_address || user.address || '',
        mailing_city: user.mailing_city || user.city || '',
        mailing_cp: user.mailing_cp || user.cp || '',
        mailing_province: user.mailing_province || user.province || '',
      });
      setFormBillingErrors({});
    }
    setIsEditingUserShippingData(newEditingState);
    if (!newEditingState) { // Si estamos cerrando el modo edición de envío
      setFormDataShipping({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        cp: user.cp || '',
        province: user.province || '',
      });
      setFormShippingErrors({});
    }
  };

  const toggleEditUserBillingData = () => {
    const newEditingState = !isEditingUserBillingData;
    if (newEditingState) { // Si vamos a abrir el form de facturación
      setIsEditingUserShippingData(false); // Cerramos el de envío
      setFormDataShipping({ // Reseteamos datos de envío por si acaso
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        cp: user.cp || '',
        province: user.province || '',
      });
      setFormShippingErrors({});
    }
    setIsEditingUserBillingData(newEditingState);
    if (!newEditingState) { // Si estamos cerrando el modo edición de facturación
      setFormDataBilling({
        cif_dni_nie: user.cif_dni_nie || '',
        mailing_name: user.mailing_name || user.name || '',
        mailing_address: user.mailing_address || user.address || '',
        mailing_city: user.mailing_city || user.city || '',
        mailing_cp: user.mailing_cp || user.cp || '',
        mailing_province: user.mailing_province || user.province || '',
      });
      setFormBillingErrors({});
    }
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataShipping(prev => ({ ...prev, [name]: value }));
    if (formShippingErrors[name as keyof UserShippingForm]) {
      setFormShippingErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataBilling(prev => ({ ...prev, [name]: value }));
    if (formBillingErrors[name as keyof UserBillingForm]) {
      setFormBillingErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateUserShippingDataForm = (): boolean => {
    const errors: Partial<UserShippingForm> = {};
    if (!formDataShipping.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!formDataShipping.address.trim()) errors.address = 'La dirección es obligatoria.';
    if (!formDataShipping.city.trim()) errors.city = 'La ciudad es obligatoria.';
    if (!formDataShipping.cp.trim()) {
      errors.cp = 'El código postal es obligatorio.';
    } else  {
      const cpValidation = validateCP(formDataShipping.cp);
      if (cpValidation !== true) {
        errors.cp = cpValidation;
      }
    }
    if (!formDataShipping.province) errors.province = 'La provincia es obligatoria.';
    
    setFormShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUserBillingDataForm = (): boolean => {
    const errors: Partial<UserBillingForm> = {};
    if (!formDataBilling.cif_dni_nie.trim()) {
        errors.cif_dni_nie = 'El CIF/DNI/NIE es obligatorio.';
    } else {
        const validation = validateCifDniNie(formDataBilling.cif_dni_nie)
        if (validation !== true) {
            errors.cif_dni_nie = validation
        }
    }
    if (!formDataBilling.mailing_name.trim()) errors.mailing_name = 'El nombre de facturación es obligatorio.';
    if (!formDataBilling.mailing_address.trim()) errors.mailing_address = 'La dirección de facturación es obligatoria.';
    if (!formDataBilling.mailing_city.trim()) errors.mailing_city = 'La ciudad de facturación es obligatoria.';
    if (!formDataBilling.mailing_cp.trim()) {
      errors.mailing_cp = 'El código postal de facturación es obligatorio.';
    } else  {
      const cpValidation = validateCP(formDataBilling.mailing_cp);
      if (cpValidation !== true) {
        errors.mailing_cp = cpValidation;
      }
    }
    if (!formDataBilling.mailing_province) errors.mailing_province = 'La provincia de facturación es obligatoria.';
    
    setFormBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUserShippingData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateUserShippingDataForm()) { // Asegúrate que esta es la validación correcta;
      try {
        const result = await updateUserShippingData(formDataShipping); // Usar formDataShipping
        if (result.success && result.user) {
            setUser(result.user)
            setIsEditingUserShippingData(false);
            setFormShippingErrors({});
            await setJWTUser()
        } else {
            console.error('Error al guardar datos de envío:', result.error)
            // Aquí podrías setear un error general para mostrar al usuario
        }
    } catch (error) {
        console.error('Error al guardar datos de envío:', error)
        // Aquí podrías setear un error general para mostrar al usuario
    }
    }
  };

  const handleSaveUserBillingData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateUserBillingDataForm()) {
      try {
        const result = await updateUserBillingData(formDataBilling); // Asumiendo que esta acción existe y acepta UserBillingForm
        if (result.success && result.user) {
            setUser(result.user);
            setIsEditingUserBillingData(false);
            setFormBillingErrors({});
            await setJWTUser(); // Refrescar el JWT si es necesario
        } else {
            console.error('Error al guardar datos de facturación:', result.error);
            // Considera mostrar un mensaje de error al usuario
        }
    } catch (error) {
        console.error('Error al guardar datos de facturación:', error);
        // Considera mostrar un mensaje de error al usuario
    }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Sección Datos de Usuario/Envío */}
      <section className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Datos de Envío</h2>
          <button 
            onClick={toggleEditUserData} 
            className="text-gray-600 hover:text-euroestetic p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-euroestetic-light"
            aria-label={isEditingUserShippingData ? "Cerrar edición" : "Editar datos de envío"}
          >
            {isEditingUserShippingData ? <FaTimes size={20} /> : <FaPencilAlt size={20} />}
          </button>
        </div>

        {isEditingUserShippingData ? (
          <form onSubmit={handleSaveUserShippingData} className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="shipping_name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                id="shipping_name"
                value={formDataShipping.name}
                onChange={handleShippingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formShippingErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formShippingErrors.name && <p className="mt-1 text-sm text-red-500">{formShippingErrors.name}</p>}
            </div>
            {/* Dirección */}
            <div>
              <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="address"
                id="shipping_address"
                value={formDataShipping.address}
                onChange={handleShippingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formShippingErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formShippingErrors.address && <p className="mt-1 text-sm text-red-500">{formShippingErrors.address}</p>}
            </div>
            {/* Ciudad */}
            <div>
              <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="city"
                id="shipping_city"
                value={formDataShipping.city}
                onChange={handleShippingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formShippingErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formShippingErrors.city && <p className="mt-1 text-sm text-red-500">{formShippingErrors.city}</p>}
            </div>
            {/* Código Postal */}
            <div>
              <label htmlFor="shipping_cp" className="block text-sm font-medium text-gray-700">Código Postal</label>
              <input
                type="text"
                name="cp"
                id="shipping_cp"
                value={formDataShipping.cp}
                onChange={handleShippingInputChange}
                maxLength={5}
                className={`mt-1 block w-full px-3 py-2 border ${formShippingErrors.cp ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formShippingErrors.cp && <p className="mt-1 text-sm text-red-500">{formShippingErrors.cp}</p>}
            </div>
            {/* Provincia */}
            <div>
              <label htmlFor="shipping_province" className="block text-sm font-medium text-gray-700">Provincia</label>
              <select
                name="province"
                id="shipping_province"
                value={formDataShipping.province}
                onChange={handleShippingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formShippingErrors.province ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              >
                <option value="">Selecciona una provincia</option>
                {PROVINCES.map((province: Province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </select>
              {formShippingErrors.province && <p className="mt-1 text-sm text-red-500">{formShippingErrors.province}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 bg-euroestetic text-white px-6 py-2 rounded-md hover:bg-euroestetic-dark transition duration-150"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="text-gray-900 font-medium">{user.name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="text-gray-900 font-medium">{user.address || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="text-gray-900 font-medium">{user.city || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Código Postal</p>
              <p className="text-gray-900 font-medium">{user.cp || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provincia</p>
              <p className="text-gray-900 font-medium">{PROVINCES.find(p => p.value === user.province)?.label || user.province || 'No especificado'}</p>
            </div>
          </div>
        )}
      </section>

      {/* Sección Datos de Facturación */}
      <section className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Datos de Facturación</h2>
          <button 
            onClick={toggleEditUserBillingData} 
            className="text-gray-600 hover:text-euroestetic p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-euroestetic-light"
            aria-label={isEditingUserBillingData ? "Cerrar edición" : "Editar datos de facturación"}
          >
            {isEditingUserBillingData ? <FaTimes size={20} /> : <FaPencilAlt size={20} />}
          </button>
        </div>

        {isEditingUserBillingData ? (
          <form onSubmit={handleSaveUserBillingData} className="space-y-4">
            {/* CIF/DNI/NIE */}
            <div>
              <label htmlFor="billing_cif_dni_nie" className="block text-sm font-medium text-gray-700">CIF/DNI/NIE</label>
              <input
                type="text"
                name="cif_dni_nie"
                id="billing_cif_dni_nie"
                value={formDataBilling.cif_dni_nie}
                onChange={handleBillingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.cif_dni_nie ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formBillingErrors.cif_dni_nie && <p className="mt-1 text-sm text-red-500">{formBillingErrors.cif_dni_nie}</p>}
            </div>
            {/* Nombre de Facturación */}
            <div>
              <label htmlFor="billing_mailing_name" className="block text-sm font-medium text-gray-700">Nombre de Facturación</label>
              <input
                type="text"
                name="mailing_name"
                id="billing_mailing_name"
                value={formDataBilling.mailing_name}
                onChange={handleBillingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.mailing_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formBillingErrors.mailing_name && <p className="mt-1 text-sm text-red-500">{formBillingErrors.mailing_name}</p>}
            </div>
            {/* Dirección de Facturación */}
            <div>
              <label htmlFor="billing_mailing_address" className="block text-sm font-medium text-gray-700">Dirección de Facturación</label>
              <input
                type="text"
                name="mailing_address"
                id="billing_mailing_address"
                value={formDataBilling.mailing_address}
                onChange={handleBillingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.mailing_address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formBillingErrors.mailing_address && <p className="mt-1 text-sm text-red-500">{formBillingErrors.mailing_address}</p>}
            </div>
            {/* Ciudad de Facturación */}
            <div>
              <label htmlFor="billing_mailing_city" className="block text-sm font-medium text-gray-700">Ciudad de Facturación</label>
              <input
                type="text"
                name="mailing_city"
                id="billing_mailing_city"
                value={formDataBilling.mailing_city}
                onChange={handleBillingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.mailing_city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formBillingErrors.mailing_city && <p className="mt-1 text-sm text-red-500">{formBillingErrors.mailing_city}</p>}
            </div>
            {/* Código Postal de Facturación */}
            <div>
              <label htmlFor="billing_mailing_cp" className="block text-sm font-medium text-gray-700">Código Postal de Facturación</label>
              <input
                type="text"
                name="mailing_cp"
                id="billing_mailing_cp"
                value={formDataBilling.mailing_cp}
                onChange={handleBillingInputChange}
                maxLength={5}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.mailing_cp ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              />
              {formBillingErrors.mailing_cp && <p className="mt-1 text-sm text-red-500">{formBillingErrors.mailing_cp}</p>}
            </div>
            {/* Provincia de Facturación */}
            <div>
              <label htmlFor="billing_mailing_province" className="block text-sm font-medium text-gray-700">Provincia de Facturación</label>
              <select
                name="mailing_province"
                id="billing_mailing_province"
                value={formDataBilling.mailing_province}
                onChange={handleBillingInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${formBillingErrors.mailing_province ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-euroestetic focus:border-euroestetic sm:text-sm`}
              >
                <option value="">Selecciona una provincia</option>
                {PROVINCES.map((province: Province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </select>
              {formBillingErrors.mailing_province && <p className="mt-1 text-sm text-red-500">{formBillingErrors.mailing_province}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white px-6 py-2 rounded-md hover:opacity-90 transition duration-150"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-gray-500">CIF/DNI/NIE</p>
              <p className="text-gray-900 font-medium">{user.cif_dni_nie || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de Facturación</p>
              <p className="text-gray-900 font-medium">{user.mailing_name || user.name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección de Facturación</p>
              <p className="text-gray-900 font-medium">{user.mailing_address || user.address || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ciudad de Facturación</p>
              <p className="text-gray-900 font-medium">{user.mailing_city || user.city || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Código Postal de Facturación</p>
              <p className="text-gray-900 font-medium">{user.mailing_cp || user.cp || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provincia de Facturación</p>
              <p className="text-gray-900 font-medium">{user.mailing_province || user.province || 'No especificado'}</p>
            </div>
          </div>
        )}
      </section>

      {/* Sección Email y Contraseña */}
      <section className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Cuenta</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <button 
              onClick={handleEditEmail}
              className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 flex items-center text-sm"
            >
              <FaPencilAlt className="mr-2" /> Editar Email
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Contraseña</p>
              <p className="text-gray-900 font-medium">••••••••</p>
            </div>
            <button 
              onClick={handleChangePassword}
              className="mt-2 sm:mt-0 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-150 flex items-center text-sm"
            >
              <FaKey className="mr-2" /> Cambiar Contraseña
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDataDashboard;
