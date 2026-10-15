export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getMe: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (token, userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

export const courseAPI = {
  getAllCourses: async () => {
    const response = await fetch(`${API_URL}/courses`);
    return handleResponse(response);
  },

  getCourse: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`);
    return handleResponse(response);
  },

  enrollCourse: async (token, courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getRecommendations: async (token) => {
    const response = await fetch(`${API_URL}/courses/recommendations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export const progressAPI = {
  updateProgress: async (token, courseId, lessonId) => {
    const response = await fetch(`${API_URL}/progress/lesson/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, lessonId }),
    });
    return handleResponse(response);
  },

  submitQuiz: async (token, courseId, answers) => {
    const response = await fetch(`${API_URL}/progress/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId, answers }),
    });
    return handleResponse(response);
  },
};

export default {
  authAPI,
  courseAPI,
  progressAPI,
};
