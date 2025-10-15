"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { NewApplicationData } from "@/models/application"
import { api } from "@/lib/api"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"


const getStatusIcon = (status: string) => {
  switch (status) {
    case "Accepted":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "Rejected":
      return <XCircle className="w-4 h-4 text-red-600" />
    case "Under Review":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "Submitted":
      return <FileText className="w-4 h-4 text-blue-600" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />
  }
}

export default function ApplicationsPage() {
  const { user, isAuthenticated } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showNewAppDialog, setShowNewAppDialog] = useState(false)
  const [newAppData, setNewAppData] = useState<NewApplicationData>({
    university: '',
    program: '',
    country: '',
    deadline: '',
    applicationFee: ''
  })
  const [universities, setUniversities] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token && user && isAuthenticated) {
          const response = await api.getApplications(token)
          if (response?.success) {
            setApplications(response.applications || [])
          }
        }
      } catch (error) {
        console.error('Failed to load applications:', error)
        alert('Error in Fetching the Data');
      }
    }

    fetchApplications()
  }, [user, isAuthenticated])

  // console.log(applications)

  

  const filterApplications = (status: string) => {
    if (status === "all") return applications || []
    return (applications || []).filter(app => app?.status?.toLowerCase()?.includes(status))
  }

  const loadUniversities = async () => {
    try {
      const response = await api.searchUniversities('')
      if (response.success) {
        setUniversities(response.data)
      }
    } catch (error) {
      console.error('Failed to load universities:', error)
      alert('Error Occured Try After SomeTime')
    }
  }

  const loadPrograms = async () => {
    try {
      const response = await api.searchPrograms('')
      if (response.success) {
        setPrograms(response.data)
      }
    } catch (error) {
      console.error('Failed to load programs:', error)
      alert('Error Occured Try After SomeTime')
    }
  }

  const handleUniversitySelect = (universityName: string) => {
    setSelectedUniversity(universityName)
    setNewAppData(prev => ({ ...prev, university: universityName }))
    // Filter programs by selected university
    const filteredPrograms = (programs || []).filter(program => program?.university === universityName)
    setPrograms(filteredPrograms)
  }



  const handleCreateApplication = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const applicationData = {
          ...newAppData,
          status: 'Draft',
          progress: 0,
          documents: [],
          missingDocuments: ['Transcripts', 'SOP', 'LORs', 'Resume'],
          lastUpdate: new Date().toISOString()
        }
        
        const response = await api.createApplication(applicationData, token)
        if (response.success) {
          setShowNewAppDialog(false)
          window.location.reload() // Refresh to get updated applications
          setNewAppData({
            university: '',
            program: '',
            country: '',
            deadline: '',
            applicationFee: ''
          })
          setSelectedUniversity('')
        }
      }
    } catch (error) {
      console.error('Failed to create application:', error)
      alert('Error Occured Try After SomeTime')

    } finally {
      setLoading(false)
    }
  }

  const handleEditApplication = (application) => {
    setEditingApp(application)
    setNewAppData({
      university: application.university || '',
      program: application.program || '',
      country: application.country || '',
      deadline: application.deadline || '',
      applicationFee: application.applicationFee || ''
    })
    setShowEditDialog(true)
  }

  const handleUpdateApplication = async () => {
    if (!editingApp) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.updateApplication(editingApp._id, newAppData, token)
        if (response.success) {
          setShowEditDialog(false)
          window.location.reload() // Refresh to get updated applications
          setEditingApp(null)
          setNewAppData({
            university: '',
            program: '',
            country: '',
            deadline: '',
            applicationFee: ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Error Occured Try After SomeTime');
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.deleteApplication(applicationId, token)
        if (response.success) {
          window.location.reload() // Refresh to get updated applications
        }
      }
    } catch (error) {
      console.error('Failed to delete application:', error)
      alert('Error Occured Try After SomeTime')
    }
  }

  const handleSubmitApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to submit this application? You cannot edit it after submission.')) return
    
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.updateApplication(applicationId, { 
          status: 'Submitted',
          progress: 100,
          submittedDate: new Date().toISOString().split('T')[0]
        }, token)
        if (response.success) {

          window.location.reload() // Refresh to get updated applications
        }
      }
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Error Occured Try After SomeTime');
    }
  }



  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                    <p className="text-muted-foreground mt-1">Track and manage your university applications</p>
                  </div>
                  <Dialog open={showNewAppDialog} onOpenChange={setShowNewAppDialog}>
                    <DialogTrigger>
                      <Button className="bg-primary hover:bg-primary/90">
                        <FileText className="w-4 h-4 mr-2" />
                        New Application
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Application</DialogTitle>
                        <DialogDescription>
                          Start a new university application
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>University</Label>
                          <Select 
                            value={newAppData.university} 
                            onValueChange={handleUniversitySelect}
                            onOpenChange={(open) => open && loadUniversities()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select university" />
                            </SelectTrigger>
                            <SelectContent>
                              {(universities || []).length > 0 ? (
                                (universities || []).map((uni) => (
                                  <SelectItem key={uni?.id || uni?.name} value={uni?.name || ''}>
                                    {uni?.name} - {uni?.country}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Program</Label>
                          <Select 
                            value={newAppData.program} 
                            onValueChange={(value) => setNewAppData(prev => ({ ...prev, program: value }))}
                            onOpenChange={(open) => open && loadPrograms()}
                            disabled={!selectedUniversity}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={selectedUniversity ? "Select program" : "Select university first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {(programs || []).length > 0 ? (
                                (programs || [])
                                  .filter(program => program?.university === selectedUniversity)
                                  .map((program) => (
                                    <SelectItem key={program?.id || program?.name} value={program?.name || ''}>
                                      {program?.name} ({program?.degreeType})
                                    </SelectItem>
                                  ))
                              ) : (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="Country"
                            value={newAppData.country}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Application Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newAppData.deadline}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, deadline: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fee">Application Fee (Optional)</Label>
                          <Input
                            id="fee"
                            placeholder="e.g., $100 USD"
                            value={newAppData.applicationFee}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, applicationFee: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowNewAppDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateApplication}
                            disabled={loading || !newAppData.university || !newAppData.program || !newAppData.country || !newAppData.deadline}
                            className="flex-1"
                          >
                            {loading ? 'Creating...' : 'Create Application'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Application Dialog */}
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Application</DialogTitle>
                        <DialogDescription>
                          Update your application details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-university">University</Label>
                          <Input
                            id="edit-university"
                            value={newAppData.university}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, university: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-program">Program</Label>
                          <Input
                            id="edit-program"
                            value={newAppData.program}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, program: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-country">Country</Label>
                          <Input
                            id="edit-country"
                            value={newAppData.country}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-deadline">Application Deadline</Label>
                          <Input
                            id="edit-deadline"
                            type="date"
                            value={newAppData.deadline}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, deadline: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-fee">Application Fee</Label>
                          <Input
                            id="edit-fee"
                            value={newAppData.applicationFee}
                            onChange={(e) => setNewAppData(prev => ({ ...prev, applicationFee: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowEditDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleUpdateApplication}
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading ? 'Updating...' : 'Update Application'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>

              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                        <p className="text-2xl font-bold text-foreground">{applications?.length || 0}</p>
                      </div>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(applications || []).filter(app => app?.status === "Under Review").length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(applications || []).filter(app => app?.status === "Accepted").length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">In Draft</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(applications || []).filter(app => app?.status === "Draft").length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Applications List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Manage your university applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="submitted">Submitted</TabsTrigger>
                        <TabsTrigger value="review">Under Review</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="space-y-4">
                        {filterApplications("all").map((app) => (
                          <Card key={app._id} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{app?.program}</h3>
                                  <p className="text-sm text-muted-foreground">{app?.university}</p>
                                  <p className="text-xs text-muted-foreground">{app?.country}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(app?.status)}
                                    <Badge className={app?.statusColor || 'bg-gray-100 text-gray-800'}>
                                      {app?.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditApplication(app)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteApplication(app._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="draft" className="space-y-4">
                        {filterApplications("draft").map((app) => (
                          <Card key={app._id} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{app?.program}</h3>
                                  <p className="text-sm text-muted-foreground">{app?.university}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(app?.status)}
                                    <Badge className={app?.statusColor || 'bg-gray-100 text-gray-800'}>
                                      {app?.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleSubmitApplication(app._id)}
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    Submit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditApplication(app)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteApplication(app._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="submitted" className="space-y-4">
                        {filterApplications("submitted").map((app) => (
                          <Card key={app._id} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{app?.program}</h3>
                                  <p className="text-sm text-muted-foreground">{app?.university}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(app?.status)}
                                    <Badge className={app?.statusColor || 'bg-gray-100 text-gray-800'}>
                                      {app?.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditApplication(app)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteApplication(app._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="review" className="space-y-4">
                        {filterApplications("review").map((app) => (
                          <Card key={app._id} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{app?.program}</h3>
                                  <p className="text-sm text-muted-foreground">{app?.university}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(app?.status)}
                                    <Badge className={app?.statusColor || 'bg-gray-100 text-gray-800'}>
                                      {app?.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditApplication(app)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteApplication(app._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="accepted" className="space-y-4">
                        {filterApplications("accepted").map((app) => (
                          <Card key={app._id} className="bg-card/50 backdrop-blur border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{app?.program}</h3>
                                  <p className="text-sm text-muted-foreground">{app?.university}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusIcon(app?.status)}
                                    <Badge className={app?.statusColor || 'bg-gray-100 text-gray-800'}>
                                      {app?.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditApplication(app)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteApplication(app._id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

