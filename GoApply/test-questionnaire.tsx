"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import RegistrationQuestionnaire from "@/components/auth/RegistrationQuestionnaire"

export default function TestQuestionnaire() {
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false)

  const handleComplete = (profileData: any) => {
    console.log('Profile data:', profileData)
    setQuestionnaireOpen(false)
  }

  return (
    <div className="p-4">
      <Button onClick={() => setQuestionnaireOpen(true)}>
        Test Registration Questionnaire
      </Button>
      
      <RegistrationQuestionnaire
        isOpen={questionnaireOpen}
        userEmail="test@example.com"
        onComplete={handleComplete}
        onClose={() => setQuestionnaireOpen(false)}
        initialStep={1}
      />
    </div>
  )
}