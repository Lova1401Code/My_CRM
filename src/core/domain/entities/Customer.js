// Customer entity factory.
export function createCustomer({
  id,
  firstname,
  lastname,
  company = '',
  email = '',
  phone = '',
  address = '',
  city = '',
  country = '',
  ownerId = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    firstname,
    lastname,
    company,
    email,
    phone,
    address,
    city,
    country,
    ownerId,
    createdAt,
    updatedAt,
  });
}