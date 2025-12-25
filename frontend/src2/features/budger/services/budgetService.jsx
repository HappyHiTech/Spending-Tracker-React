import { API_BASE_URL } from "@utils/constants";

export const getCategoriesService = async(token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_categories`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    return response;
}

export const budgetAdderService = async(token, formTarget) => {
    const response = await fetch(`${API_BASE_URL}/api/add_budget`, {
        method: "POST",
        body: new FormData(formTarget),
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response;
}

export const getBudgetListService = async(token) => {
    const response = await fetch(`${API_BASE_URL}/api/get_budget`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response;
}

export const deleteBudgetService = async(token, category) => {
    const response = await fetch(`${API_BASE_URL}/api/delete_budget`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category })
    })

    return response;
}