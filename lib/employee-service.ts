import axios from "axios"

// Configure axios base URL - update this to match your Spring Boot backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
})

export interface Employee {
  id: number
  name: string
  email: string
  department: string
}

// Mock data for development/testing
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@company.com",
    department: "Sales",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Human Resources",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Finance",
  },
]

const mockData = [...mockEmployees]
let nextId = 6

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Check if we should use mock data (when API is unavailable)
const shouldUseMockData = async (): Promise<boolean> => {
  try {
    await api.get("/api/employees", { timeout: 2000 })
    return false
  } catch (error) {
    console.warn("Backend API unavailable, using mock data for development")
    return true
  }
}

export const employeeService = {
  // Get all employees
  getAllEmployees: async (): Promise<Employee[]> => {
    try {
      const response = await api.get("/api/employees")
      return response.data
    } catch (error) {
      console.warn("API unavailable, using mock data")
      await delay(500) // Simulate network delay
      return [...mockData]
    }
  },

  // Get employee by ID
  getEmployeeById: async (id: number): Promise<Employee> => {
    try {
      const response = await api.get(`/api/employees/${id}`)
      return response.data
    } catch (error) {
      console.warn("API unavailable, using mock data")
      await delay(300)
      const employee = mockData.find((emp) => emp.id === id)
      if (!employee) {
        throw new Error("Employee not found")
      }
      return employee
    }
  },

  // Create new employee
  createEmployee: async (employee: Omit<Employee, "id">): Promise<Employee> => {
    try {
      const response = await api.post("/api/employees", employee)
      return response.data
    } catch (error) {
      console.warn("API unavailable, using mock data")
      await delay(500)
      const newEmployee: Employee = {
        ...employee,
        id: nextId++,
      }
      mockData.push(newEmployee)
      return newEmployee
    }
  },

  // Update employee
  updateEmployee: async (id: number, employee: Omit<Employee, "id">): Promise<Employee> => {
    try {
      const response = await api.put(`/api/employees/${id}`, employee)
      return response.data
    } catch (error) {
      console.warn("API unavailable, using mock data")
      await delay(500)
      const index = mockData.findIndex((emp) => emp.id === id)
      if (index === -1) {
        throw new Error("Employee not found")
      }
      const updatedEmployee: Employee = { ...employee, id }
      mockData[index] = updatedEmployee
      return updatedEmployee
    }
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/employees/${id}`)
    } catch (error) {
      console.warn("API unavailable, using mock data")
      await delay(300)
      const index = mockData.findIndex((emp) => emp.id === id)
      if (index === -1) {
        throw new Error("Employee not found")
      }
      mockData.splice(index, 1)
    }
  },
}

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("API request timeout")
    } else if (error.response) {
      console.error("API Error:", error.response.data || error.message)
    } else if (error.request) {
      console.error("Network Error: Unable to reach the server")
    } else {
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)
