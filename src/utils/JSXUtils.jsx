export const getMenuList = (categoriesData, serviceData, city) => {
    let menuList = [{name: <div class="text-14 fw-500 text-blue-1 mt-5">Venues</div>, routerPath : '/venues'}];
    const categories = categoriesData.map((category) => ({
      name: <div class="text-14 fw-500">{category.category_name} in {city.city_name}</div>,
      routerPath: `/venues?city_name=${encodeURIComponent(city.city_name)}&venue_categories[]=${encodeURIComponent(category.category_name)}`,
    }))
    menuList = [...menuList,...categories];
    menuList.push({name:<div class="text-14 fw-500 text-blue-1 mt-5">Vendors</div>, routerPath : '/vendors'});
    const citydata = serviceData.map((service) => ({
      name: <div class="text-14 fw-500">{service.service_name} in {city.city_name}</div>,
      routerPath: `/vendors?city_name=${encodeURIComponent(city.city_name)}&vendor_service=${encodeURIComponent(service.service_name)}`,
    }))
    return [...menuList, ...citydata];
  }
  
  export const transformDataForCategory = (data) => {
    const { cityData, serviceData } = data;
  
    // Check if cityData and categoriesData exist and are not empty
    if (!cityData || !serviceData || cityData.length === 0 || serviceData.length === 0) {
      return []; // Handle invalid data gracefully by returning an empty array
    }
    // Transform each city and its categories
    return cityData.map((city) => ({
      id: city.city_id,
      title: <div class="text-14 fw-500 text-blue-1 mt-5">{city.city_name}</div>,
      menuList: serviceData.map((service) => ({
        name: `${service.service_name} in ${city.city_name}`,
        routerPath: `/vendors?city_name=${encodeURIComponent(city.city_name)}&vendor_service=${encodeURIComponent(service.service_name)}`,
      })),
    }));
  };
  
  export const transformDataForCityAndCategory = (data) => {
    const { cityData, categoriesData, serviceData } = data;
  
    // Check if cityData and categoriesData exist and are not empty
    if (!cityData || !categoriesData || cityData.length === 0 || categoriesData.length === 0) {
      return []; // Handle invalid data gracefully by returning an empty array
    }
  
    // Transform each city and its categories
    return cityData.map((city) => ({
      id: city.city_id,
      title: <div class="text-14 fw-500 text-blue-1 mt-5">{city.city_name}</div>,
      menuList: getMenuList(categoriesData, serviceData, city)
    }));
  };
  
  export const transformDataForCity = (data) => {
    const { cityData, categoriesData } = data;
  
    // Check if cityData and categoriesData exist and are not empty
    if (!cityData || !categoriesData || cityData.length === 0 || categoriesData.length === 0) {
      return []; // Handle invalid data gracefully by returning an empty array
    }
  
    // Transform each city and its categories
    return cityData.map((city) => ({
      id: city.city_id,
      title: <div class="text-14 fw-500 text-blue-1 mt-5">{city.city_name}</div>,
      menuList: categoriesData.map((category) => ({
        name: `${category.category_name} in ${city.city_name}`,
        routerPath: `/venues?city_name=${encodeURIComponent(city.city_name)}&venue_categories[]=${encodeURIComponent(category.category_name)}`,
      })),
    }));
  };