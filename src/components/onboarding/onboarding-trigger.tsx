"use client";

import { useState, useEffect } from "react";
import { OnboardingModal } from "./onboarding-modal";

interface OnboardingTriggerProps {
  userName: string;
  onboardingCompleted: boolean;
}

export function OnboardingTrigger({ userName, onboardingCompleted }: OnboardingTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!onboardingCompleted) {
      setIsOpen(true);
    }
  }, [onboardingCompleted]);

  return (
    <OnboardingModal 
      userName={userName} 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
    />
  );
}
