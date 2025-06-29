"use client"

import { Mail, Building2, User } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Employee } from "@/lib/employee-service"

interface EmployeeDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
}

export default function EmployeeDetails({ open, onOpenChange, employee }: EmployeeDetailsProps) {
  if (!employee) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Employee Details</SheetTitle>
          <SheetDescription>View detailed information about the employee</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">Employee ID: {employee.id}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <Badge variant="secondary" className="mt-1">
                  {employee.department}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Additional Information</h4>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                This employee is part of the {employee.department} department and can be reached at {employee.email}.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
