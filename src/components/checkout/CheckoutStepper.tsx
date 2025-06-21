'use client'
import { User } from '@/payload-types'
import { useEffect, useState } from 'react'
import { FaTruck, FaFileInvoice, FaCreditCard, FaCheck } from 'react-icons/fa'
import { ShippingForm } from './ShippingForm'
import { UserShippingForm, ShippingFormErrors } from './types'
import { updateUserShippingData, updateUserBillingData } from './checkoutActions'
import { BillingForm } from './BillingForm'
import { UserBillingForm as BillingFormType, BillingFormErrors } from './types'
import { PaymentForm } from './PaymentForm'
import Redsys from './redsys/Redsys'
import { validateCifDniNie, validateCP } from 'utils/validations'

interface StepProps {
  icon: React.ReactNode
  title: string
  isActive: boolean
  isCompleted: boolean
}

const Step: React.FC<StepProps> = ({ icon, title, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center relative">
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center
        ${isActive ? 'bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white' : 
          isCompleted ? 'bg-green-500 text-white' : 
          'bg-gray-200 text-gray-500'}
        transition-all duration-300
      `}>
        {isCompleted ? <FaCheck size={20} /> : icon}
      </div>
      <div className={`
        mt-2 text-sm font-medium
        ${isActive ? 'text-euroestetic' : 
          isCompleted ? 'text-green-500' : 
          'text-gray-500'}
      `}>
        {title}
      </div>
      
    </div>
  )
}

export const CheckoutStepper = ({user:userProp}:{user: User}) => {
  const [user, setUser] = useState<User>(userProp)
  const [step, setStep] = useState(1)
  const initShippingForm: UserShippingForm = {
    email: user.email || '',
    name: user.name || '',
    address: user.address || '',
    city: user.city || '',
    cp: user.cp || '',
    province: user.province || ''
}
const [userShippingForm, setUserShippingForm] = useState(initShippingForm)
const [shippingErrors, setShippingErrors] = useState<ShippingFormErrors>({})
const validateForm = (): boolean => {
  const newErrors: ShippingFormErrors = {}
  
  if (!userShippingForm.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
  }
  
  if (!userShippingForm.address.trim()) {
      newErrors.address = 'La dirección es obligatoria'
  }
  
  if (!userShippingForm.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria'
  }
  
  // En la función validateForm() - líneas 73-79:
  if (!userShippingForm.cp.trim()) {
      newErrors.cp = 'El código postal es obligatorio'
  } else {
      const cpValidation = validateCP(userShippingForm.cp);
      if (cpValidation !== true) {
          newErrors.cp = cpValidation;
      }
  }
  
  if (!userShippingForm.province) {
      newErrors.province = 'La provincia es obligatoria'
  }

  setShippingErrors(newErrors)
  return Object.keys(newErrors).length === 0
}


  const steps = [
    { icon: <FaTruck size={20} />, title: 'Datos de Envío' },
    { icon: <FaFileInvoice size={20} />, title: 'Datos de Facturación' },
    { icon: <FaCreditCard size={20} />, title: 'Resumen y Pago' }
  ]

  const handleShippingSubmit = async () => {
    try {
        const result = await updateUserShippingData(userShippingForm)
        if (result.success && result.user) {
            setUser(result.user)
            setStep(2)
        } else {
            console.error('Error al guardar datos de envío:', result.error)
        }
    } catch (error) {
        console.error('Error al guardar datos de envío:', error)
    }
  }

  const handleBillingSubmit = async () => {
    try {
        const result = await updateUserBillingData(billingForm)
        if (result.success && result.user) {
            setUser(result.user)
            setStep(3)
        } else {
            console.error('Error al guardar datos de facturación:', result.error)
        }
    } catch (error) {
        console.error('Error al guardar datos de facturación:', error)
    }
  }

  const initBillingForm: BillingFormType = {
      cif_dni_nie: user.cif_dni_nie || '',
      mailing_name: user.mailing_name || '',
      mailing_address: user.mailing_address || '',
      mailing_city: user.mailing_city || '',
      mailing_cp: user.mailing_cp || '',
      mailing_province: user.mailing_province || ''
  }
  
  const [billingForm, setBillingForm] = useState(initBillingForm)
  const [billingErrors, setBillingErrors] = useState<BillingFormErrors>({})

  const validateBillingForm = (): boolean => {
      const newErrors: BillingFormErrors = {}
      
      if (!billingForm.cif_dni_nie.trim()) {
          newErrors.cif_dni_nie = 'El CIF/DNI/NIE es obligatorio'
      } else {
          const validation = validateCifDniNie(billingForm.cif_dni_nie)
          if (validation !== true) {
              newErrors.cif_dni_nie = validation
          }
      }
      
      if (!billingForm.mailing_name.trim()) {
          newErrors.mailing_name = 'El nombre es obligatorio'
      }
      
      if (!billingForm.mailing_address.trim()) {
          newErrors.mailing_address = 'La dirección es obligatoria'
      }
      
      if (!billingForm.mailing_city.trim()) {
          newErrors.mailing_city = 'La ciudad es obligatoria'
      }
      
      // En la función validateBillingForm() - líneas 157-163:
      if (!billingForm.mailing_cp.trim()) {
          newErrors.mailing_cp = 'El código postal es obligatorio'
      } else {
          const cpValidation = validateCP(billingForm.mailing_cp);
          if (cpValidation !== true) {
              newErrors.mailing_cp = cpValidation;
          }
      }
      
      if (!billingForm.mailing_province) {
          newErrors.mailing_province = 'La provincia es obligatoria'
      }
  
      setBillingErrors(newErrors)
      return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (step === 1) {
          if (validateForm()) {
              handleShippingSubmit()
              return
          }
          return
      }
      if (step === 2) {
          if (validateBillingForm()) {
              handleBillingSubmit()
              return
          }
          return
      }
  }
  useEffect(() => {
    if (user) {
      setUserShippingForm({
        email: user.email || '',
        name: user.name || '',
        address: user.address || '',
        city: user.city || '',
        cp: user.cp || '',
        province: user.province || ''
      })
      setBillingForm({
        cif_dni_nie: user.cif_dni_nie || '',
        mailing_name: user.mailing_name || '',
        mailing_address: user.mailing_address || '',
        mailing_city: user.mailing_city || '',
        mailing_cp: user.mailing_cp || '',
        mailing_province: user.mailing_province || ''
      })
    }
  }, [user])

  return (
    <div className="min-h-[75vh] max-w-4xl mx-auto p-8 bg-white rounded-lg">
      <div className="flex justify-between mb-12 relative">
        {steps.map((stepItem, index) => (
          <Step
            key={index}
            icon={stepItem.icon}
            title={stepItem.title}
            isActive={step === index + 1}
            isCompleted={step > index + 1}
          />
        ))}
      </div>
      
      <div className="mt-8">
        {/* Aquí irá el contenido de cada paso */}
        {step === 1 && 
          <div>
            <ShippingForm 
             userShippingForm={userShippingForm}
             setUserShippingForm={setUserShippingForm} 
             shippingErrors={shippingErrors}
             setShippingErrors={setShippingErrors}
            />
          </div>
        }
        {step === 2 && 
          <div>
            <BillingForm 
              billingForm={billingForm}
              setBillingForm={setBillingForm}
              billingErrors={billingErrors}
              setBillingErrors={setBillingErrors}
            />
          </div>
        }
        {step === 3  && (
          <PaymentForm user={user} />
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() =>{ 
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setStep(prev => Math.max(1, prev - 1))
          }}
          className={`
            px-6 py-2 rounded-lg
            ${step === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white hover:opacity-90'}
          `}
          disabled={step === 1}
        >
          Anterior
        </button>
        {step < 3 && 
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-lg hover:opacity-90"
          >
            Siguiente
          </button>
        }
        {step === 3 &&
         <Redsys />
        }
      </div>
    </div>
  )
}