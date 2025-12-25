import { API_BASE_URL } from "@utils/constants";

export const getDataService = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_data`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    return response;
}

export const adderClickService = async (token, formTarget) => {
    const response = await fetch(`${API_BASE_URL}/api/add_data`,{
        method: "POST",
        body: new FormData(formTarget),
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    return response;
}

export const deleteClickService = async (token, item_id) => {
    const response = await fetch(`${API_BASE_URL}/api/remove_data`, {
        method: "POST",
        body: JSON.stringify({ item_id }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    return response;
}

export const totalSpentService = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_total_spent`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response;
}

export const percentPerCategoryService = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_percent_per_category`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response;
}

export const pricePerCategoryService = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_price_per_category`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response;
}