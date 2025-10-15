"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Briefcase,
  Globe,
  Edit,
  Save,
  Upload,
  Award,
  Languages,
  BookOpen
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"


export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)


  // Keep track of original data for cancel functionality
  const [originalData, setOriginalData] = useState({})
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    bio: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await api.getCurrentUser(token)
          if (response?.success) {
            const userData = response.data.user
            const userProfile = response.data.profile
            
            setProfileData({
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",
              email: userData?.email || "",
              phone: userProfile?.phone || "",
              dateOfBirth: userProfile?.dateOfBirth || "",
              nationality: userProfile?.nationality || "",
              address: userProfile?.address || "",
              bio: userProfile?.bio || ""
            })
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])



  const handleSave = async () => {
    try {
      // TODO: Implement profile save functionality
      setOriginalData({ ...profileData })
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCancel = () => {
    // Restore data to original state
    setProfileData({ ...profileData, ...originalData })
    setIsEditing(false)
  }

  const handleEdit = () => {
    // Store current state as original before editing
    setOriginalData({ ...profileData })
    setIsEditing(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
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
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Profile Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                          <AvatarFallback className="text-2xl">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground">
                          {profileData.firstName} {profileData.lastName}
                        </h2>
                        <p className="text-muted-foreground mb-2">{profileData.email}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profileData.nationality}
                          </div>
                          {profileData.dateOfBirth && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Born {new Date(profileData.dateOfBirth).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {profileData.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal and professional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="personal">Personal Information</TabsTrigger>
                      </TabsList>

                      {/* Personal Information */}
                      <TabsContent value="personal" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                              id="nationality"
                              value={profileData.nationality}
                              onChange={(e) => handleInputChange("nationality", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={profileData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={4}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </TabsContent>


                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}