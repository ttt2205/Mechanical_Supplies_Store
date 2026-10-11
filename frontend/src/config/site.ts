export const siteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Hưng Thịnh',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_FULL || '208 Lò Siêu, Phường 12, Quận 11, TP. Hồ Chí Minh',
  addressShort: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_SHORT || '208 Lò Siêu, P. 12, Q. 11, TP. HCM',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE_RAW || '0123456789',
  phoneFormatted: process.env.NEXT_PUBLIC_COMPANY_PHONE_FORMATTED || '0123.456.789',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@hungthinh-hydraulics.vn',
  emailShort: process.env.NEXT_PUBLIC_COMPANY_EMAIL_SHORT || 'contact@hungthinh.vn',
  zalo: process.env.NEXT_PUBLIC_COMPANY_ZALO || '0123456789',
  mapQuery: process.env.NEXT_PUBLIC_COMPANY_MAP_QUERY || '208+Lò+Siêu,+Phường+12,+Quận+11,+Hồ+Chí+Minh',
  mapEmbed: process.env.NEXT_PUBLIC_COMPANY_MAP_EMBED || '208%20Lò%20Siêu,%20Phường%2012,%20Quận%2011,%20Hồ%20Chí%20Minh',
};
