"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  Video,
  Phone,
  Heart,
  CheckCircle
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { api } from "@/lib/api"


export default function MentorshipPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true)
      try {
        const response = await api.getMentors()
        if (response.success) {
          setMentors(response.data)
        }
      } catch (error) {
        console.error('Failed to load mentors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMentors()
  }, [])

  const toggleFavorite = (mentorId: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle favorite for mentor ${mentorId}`)
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
                    <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
                    <p className="text-muted-foreground mt-1">Connect with experienced mentors to guide your journey</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Users className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
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
                        <p className="text-sm font-medium text-muted-foreground">My Mentors</p>
                        <p className="text-2xl font-bold text-foreground">0</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                        <p className="text-2xl font-bold text-foreground">0</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-bold text-foreground">0</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hours Completed</p>
                        <p className="text-2xl font-bold text-foreground">0</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>Mentorship Hub</CardTitle>
                    <CardDescription>Discover mentors, manage sessions, and track your progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="discover">Discover</TabsTrigger>
                        <TabsTrigger value="my-mentors">My Mentors</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                      </TabsList>

                      {/* Discover Mentors */}
                      <TabsContent value="discover" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {mentors.map((mentor, index) => (
                            <motion.div
                              key={mentor.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur hover:bg-background/70 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-16 h-16">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                    <AvatarFallback>
                                      {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-foreground text-lg">{mentor.name}</h3>
                                    <p className="text-muted-foreground">{mentor.title}</p>
                                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => toggleFavorite(mentor.id)}
                                  >
                                    <Heart className={`w-4 h-4 ${mentor.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Badge className={
                                    mentor.availability === "Available" 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  }>
                                    {mentor.availability}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <GraduationCap className="w-4 h-4" />
                                  {mentor.degree} from {mentor.university}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  {mentor.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  {mentor.rating} ({mentor.reviews} reviews) • {mentor.sessions} sessions
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                                <div className="flex flex-wrap gap-2">
                                  {mentor.specialties.map((specialty) => (
                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-4">{mentor.bio}</p>

                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <p className="font-medium text-foreground">${mentor.hourlyRate}/hour</p>
                                  <p className="text-muted-foreground">Next: {mentor.nextSlot}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur border-border/50">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Book Session
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
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