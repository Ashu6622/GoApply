const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = {
  // Auth endpoints
  register: async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return response.json()
  },

  completeProfile: async (profileData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/profile/questionnaire`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })
    return response.json()
  },

  getQuestionnaire: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/profile/questionnaire`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  saveProgress: async (step: number, profileData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/profile/questionnaire`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })
    return response.json()
  },

  // getProfile: async (token: string) => {
  //   const response = await fetch(`${API_BASE_URL}/auth/profile`, {
  //     method: 'GET',
  //     headers: { 
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  //   return response.json()
  // },

  submitContact: async (contactData: { name: string; email: string; phone: string; country: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    })
    return response.json()
  },

  getFieldsOfStudy: async () => {
    console.log("****");
    const response = await fetch(`${API_BASE_URL}/static/fields-of-study`)
    return response.json()
  },

  getNationalities: async () => {
    const response = await fetch(`${API_BASE_URL}/static/nationalities`)
    return response.json()
  },

  searchUniversities: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/search/universities?q=${encodeURIComponent(query)}`)
    return response.json()
  },

  searchPrograms: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/search/programs?q=${encodeURIComponent(query)}`)
    return response.json()
  },

  // Dashboard Applications
  getApplications: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  createApplication: async (applicationData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    })
    return response.json()
  },

  getApplication: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  updateApplication: async (id: string, applicationData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    })
    return response.json()
  },

  deleteApplication: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  // Mentorship
  getMentors: async () => {
    const response = await fetch(`${API_BASE_URL}/mentorship/mentors`)
    return response.json()
  },

  // User
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  updateProfile: async (profileData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })
    return response.json()
  }
}