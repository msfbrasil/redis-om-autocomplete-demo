const CUSTOMERS_BASE_URL = 'http://localhost:8080/customers';

const CustomersAPI = function () { };

CustomersAPI.parseResponse = async function (response) {
  const body = await response.text();
  const json = JSON.parse(body);

  return json;
};

CustomersAPI.getSuggestions = async function (query) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let actionUrl = `${CUSTOMERS_BASE_URL}/search/${encodeURIComponent(query)}`;

  const response = await fetch(actionUrl, requestOptions);

  return CustomersAPI.parseResponse(response);
}

export default CustomersAPI;