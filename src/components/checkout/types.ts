export interface UserShippingForm {
    email: string;
    name: string;
    address: string;
    city: string;
    cp: string;
    province: string;
}

export interface ShippingFormErrors {
    name?: string;
    address?: string;
    city?: string;
    cp?: string;
    province?: string;
}

export interface UserBillingForm {
    cif_dni_nie: string;
    mailing_name: string;
    mailing_address: string;
    mailing_city: string;
    mailing_cp: string;
    mailing_province: string;
}

export interface BillingFormErrors {
    cif_dni_nie?: string;
    mailing_name?: string;
    mailing_address?: string;
    mailing_city?: string;
    mailing_cp?: string;
    mailing_province?: string;
}
