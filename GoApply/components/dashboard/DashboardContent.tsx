"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  GraduationCap, 
  MapPin, 
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  AlertCircle
} from "lucide-react"

export default function DashboardContent() {
  const { user, applications: userApplications, mentorships, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const stats = useMemo(() => {
    const submittedApps = userApplications?.filter(app => app?.status === 'Submitted' || app?.status === 'Under Review' || app?.status === 'Accepted') || []
    const uniqueUniversities = new Set(userApplications?.map(app => app?.universityName) || [])
    
    return [
      {
        title: "Applications Submitted",
        value: (submittedApps?.length || 0).toString(),
        change: "+3 this month",
        icon: BookOpen,
        color: "text-blue-600"
      },
      {
        title: "Universities Applied",
        value: uniqueUniversities.size.toString(),
        change: "+2 this month",
        icon: GraduationCap,
        color: "text-primary"
      },
      {
        title: "Active Mentorships",
        value: (mentorships?.length || 0).toString(),
        change: "All active",
        icon: Users,
        color: "text-green-600"
      },
      {
        title: "Profile Completion",
        value: user?.profileCompleted ? "100%" : "95%",
        change: "Almost done!",
        icon: FileText,
        color: "text-orange-600"
      }
    ]
  }, [userApplications, mentorships, user])

  
  const getUserDisplayName = () => {
    if (user?.firstName) {
      return user.firstName
    }
    return user?.email?.split('@')[0] || 'User'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under review': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {getUserDisplayName()}! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your applications</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <BookOpen className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Track your application progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : userApplications?.slice(0, 3)?.length > 0 ? (
                userApplications?.slice(0, 3)?.map((app) => (
                  <div key={app?._id} className="p-4 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{app?.universityName || 'Unknown University'}</h4>
                        <p className="text-sm text-muted-foreground">{app?.programName || 'Unknown Program'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{app?.country || 'Unknown'}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(app?.status || 'draft')}>{app?.status || 'Draft'}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{app?.progress || 0}%</span>
                      </div>
                      <Progress value={app?.progress || 0} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Deadline: {app?.deadline || 'Not set'}</span>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No applications yet</p>
                  <p className="text-sm">Start your journey by creating your first application</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
        </motion.div>
      </div>

      {/* Recommended Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Find Programs</h3>
            <p className="text-sm text-muted-foreground mb-4">Discover programs that match your interests</p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Explore Programs
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Upload Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">Keep your documents organized and ready</p>
            <Button variant="outline" className="w-full border-green-500/20 hover:bg-green-500/5">
              Manage Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Get Mentorship</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect with experts and students</p>
            <Button variant="outline" className="w-full border-blue-500/20 hover:bg-blue-500/5">
              Find Mentors
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}