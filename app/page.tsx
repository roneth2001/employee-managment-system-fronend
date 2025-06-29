"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import EmployeeTable from "@/components/employee-table"
import EmployeeForm from "@/components/employee-form"
import EmployeeDetails from "@/components/employee-details"
import { employeeService, type Employee } from "@/lib/employee-service"
import ConnectionStatus from "@/components/connection-status"
import dynamic from 'next/dynamic';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { toast } = useToast()
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
      // Check if we're using mock data by trying to detect mock data patterns
      setIsUsingMockData(data.some((emp) => emp.email.includes("@company.com")))
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      toast({
        title: "Connection Issue",
        description: "Using demo data. Check your backend connection.",
        variant: "default",
      })
      setIsUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDetails(true)
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingEmployee(null)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id)
      setEmployees(employees.filter((emp) => emp.id !== id))
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async (employeeData: Omit<Employee, "id">) => {
    try {
      if (editingEmployee) {
        const updated = await employeeService.updateEmployee(editingEmployee.id, employeeData)
        setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? updated : emp)))
        toast({
          title: "Success",
          description: "Employee updated successfully",
        })
      } else {
        const created = await employeeService.createEmployee(employeeData)
        setEmployees([...employees, created])
        toast({
          title: "Success",
          description: "Employee added successfully",
        })
      }
      setShowForm(false)
      setEditingEmployee(null)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingEmployee ? "update" : "add"} employee`,
        variant: "destructive",
      })
    }
  }
  

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Employee Management System</h1>
          </div>
        </div>
      </nav>

      {isUsingMockData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> Backend API unavailable. Using sample data for demonstration.
                  <span className="ml-2 text-xs">
                    Configure your Spring Boot backend at{" "}
                    <code className="bg-yellow-100 px-1 rounded">http://localhost:8080</code>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
            <p className="text-gray-600">Manage your organization's employees</p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <EmployeeTable
          employees={employees}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Employee Form Modal */}
        <EmployeeForm
          open={showForm}
          onOpenChange={setShowForm}
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
        />

        {/* Employee Details Drawer */}
        <EmployeeDetails open={showDetails} onOpenChange={setShowDetails} employee={selectedEmployee} />
      </main>
    </div>
  )
}
