import { GlobalConfig } from "payload";
import { PROVINCES } from "utils/consts";
import { validateCP } from "utils/validations";
import { validateCifDniNie } from 'utils/validations'

export const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  label: {
    singular: 'Información de la Empresa',
    plural: 'Datos de la Empresa',
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      maxLength: 150
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      maxLength: 250
    },
    {
      name: 'cif_dni_nie',
      label: 'CIF / DNI / NIE',
      type: 'text',
      validate: (value: any) => {
        return validateCifDniNie(value);
    },
},
    {
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      maxLength: 150
    },
    {
      name: 'cp',
      label: 'Código Postal',
      type: 'text',
      validate: (value: any) => {
        return validateCP(value);
      },
      maxLength: 5
    },
    {
      name: 'province',
      label: 'Provincia',
      type: 'select',
      options: PROVINCES,
      required: true,
    }
  ]
};