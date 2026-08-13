"use client";

import React from 'react';
import { EventData, Joyride, STATUS, Step } from 'react-joyride';

const TOUR_STORAGE_KEY = 'niyara-demo-tour-complete';

const tourSteps: Step[] = [
  {
    target: '[data-tour="tour-launcher"]',
    title: 'Start here anytime',
    content: 'Open this guided tour whenever you want a quick orientation around the planning workspace.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: 'Move between planning areas',
    content: 'Use this navigation rail to jump into the dashboard, guest list, vendors, tasks, and wedding profile.',
    placement: 'right',
  },
  {
    target: '[data-tour="dashboard-summary"]',
    title: 'Read the planning snapshot',
    content: 'These cards summarize guests, vendors, remaining tasks, and completed work so the couple can scan progress quickly.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="dashboard-milestones"]',
    title: 'Review next milestones',
    content: 'The milestone panel turns profile and task data into the next planning priorities.',
    placement: 'top',
  },
  {
    target: '[data-tour="dashboard-readiness"]',
    title: 'Check wedding readiness',
    content: 'This score gives a quick health check for planning progress, budget usage, and countdown timing.',
    placement: 'left',
  },
];

type DemoTourProps = {
  run: boolean;
  onClose: () => void;
};

export default function DemoTour({ run, onClose }: DemoTourProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  const handleTourEvent = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      window.localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      onClose();
    }
  };

  return (
    <Joyride
      continuous
      onEvent={handleTourEvent}
      options={{
        arrowColor: '#ffffff',
        backgroundColor: '#ffffff',
        buttons: ['back', 'skip', 'primary'],
        closeButtonAction: 'skip',
        overlayColor: 'rgba(18, 16, 25, 0.72)',
        primaryColor: '#ba3a50',
        showProgress: true,
        textColor: '#333333',
        zIndex: 1500,
      }}
      run={run}
      scrollToFirstStep
      steps={tourSteps}
      styles={{
        buttonBack: {
          color: '#666666',
          marginRight: 8,
        },
        buttonPrimary: {
          borderRadius: 8,
          fontWeight: 700,
        },
        buttonSkip: {
          color: '#666666',
        },
        tooltip: {
          borderRadius: 12,
          boxShadow: '0 18px 48px rgba(0, 0, 0, 0.2)',
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 800,
        },
      }}
    />
  );
}

export function shouldAutoStartDemoTour() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(TOUR_STORAGE_KEY) !== 'true';
}
