// Merkezi API Servisi
// Tüm backend istekleri bu dosya aracılığıyla yapılır.
// .env dosyasındaki VITE_API_URL üretim/geliştirme ortamında otomatik değişir.

const BASE_URL = import.meta.env.VITE_API_URL || 'https://website-rkfz.onrender.com';

// --- Genel yardımcı ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

const handleResponse = async (res) => {
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { errors: [`Sunucudan beklenen JSON yanıtı gelmedi (HTTP ${res.status})`] };
    }
    
    if (!res.ok) throw new Error(data?.errors?.[0] || data?.message || `HTTP ${res.status}`);
    return data;
};

// --- Retry mekanizması: Render cold start 500 hatalarını otomatik tekrar dener ---
const fetchWithRetry = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.status >= 500 && i < retries - 1) {
                // 500 hatası → kısa bekle, tekrar dene
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                continue;
            }
            return handleResponse(res);
        } catch (err) {
            if (i < retries - 1) {
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                continue;
            }
            throw err;
        }
    }
};

// --- AUTH ---
export const login = async (username, password) => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
};

// --- PROFILE ---
export const getProfile = async () => {
    return fetchWithRetry(`${BASE_URL}/api/v1/profile`);
};

export const saveProfile = async (profile) => {
    const res = await fetch(`${BASE_URL}/api/v1/profile`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(profile),
    });
    return handleResponse(res);
};

// --- PROJECTS ---
export const getProjects = async () => {
    return fetchWithRetry(`${BASE_URL}/api/v1/projects`);
};

export const createProject = async (project) => {
    const res = await fetch(`${BASE_URL}/api/v1/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
    });
    return handleResponse(res);
};

export const updateProject = async (id, project) => {
    const res = await fetch(`${BASE_URL}/api/v1/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
    });
    return handleResponse(res);
};

export const deleteProject = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

export const getActiveProjects = async () => {
    return fetchWithRetry(`${BASE_URL}/api/v1/projects/active`);
};

export const toggleProjectActive = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/projects/${id}/toggle-active`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

export const reorderProjects = async (requestList) => {
    const res = await fetch(`${BASE_URL}/api/v1/projects/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestList),
    });
    return handleResponse(res);
};

// --- SKILLS ---
export const getSkills = async () => {
    return fetchWithRetry(`${BASE_URL}/api/v1/skills`);
};

export const createSkill = async (skill) => {
    const res = await fetch(`${BASE_URL}/api/v1/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skill),
    });
    return handleResponse(res);
};

export const deleteSkill = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

// --- MESSAGES ---
export const getMessages = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/messages`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

export const sendMessage = async (messageRequest) => {
    const res = await fetch(`${BASE_URL}/api/v1/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageRequest),
    });
    return handleResponse(res);
};

export const deleteMessage = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

// --- EDUCATIONS ---
export const getEducations = async () => {
    return fetchWithRetry(`${BASE_URL}/api/v1/educations`);
};

export const createEducation = async (education) => {
    const res = await fetch(`${BASE_URL}/api/v1/educations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(education),
    });
    return handleResponse(res);
};

export const updateEducation = async (id, education) => {
    const res = await fetch(`${BASE_URL}/api/v1/educations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(education),
    });
    return handleResponse(res);
};

export const deleteEducation = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/educations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};

export const reorderEducations = async (requestList) => {
    const res = await fetch(`${BASE_URL}/api/v1/educations/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestList),
    });
    return handleResponse(res);
};

