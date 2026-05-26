export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
export const TRANSMISSIONS = ['Manual', 'Automatic'];
export const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];

export function filterCars(cars, filters) {
  let result = [...cars];

  if (filters.brand) {
    const b = filters.brand.toLowerCase();
    result = result.filter((c) => (c.brand || '').toLowerCase() === b);
  }
  if (filters.fuelType) {
    result = result.filter((c) => c.fuelType === filters.fuelType);
  }
  if (filters.city) {
    const city = filters.city.toLowerCase();
    result = result.filter((c) => (c.city || '').toLowerCase() === city);
  }
  if (filters.priceMin != null && filters.priceMin !== '') {
    result = result.filter((c) => Number(c.price) >= Number(filters.priceMin));
  }
  if (filters.priceMax != null && filters.priceMax !== '') {
    result = result.filter((c) => Number(c.price) <= Number(filters.priceMax));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((c) => {
      const hay = [c.title, c.brand, c.model, c.city, c.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  return result;
}

export function uniqueValues(cars, field) {
  const set = new Set();
  cars.forEach((c) => {
    const v = c[field];
    if (v) set.add(v);
  });
  return [...set].sort();
}
