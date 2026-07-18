/** Central media registry for mock data */

export const media = {
  imaging: {
    mriBrain: "/media/imaging/mri-brain.svg",
    mriSpine: "/media/imaging/mri-spine.svg",
    mriKnee: "/media/imaging/mri-knee.svg",
    ctAbdomen: "/media/imaging/ct-abdomen.svg",
    ultrasoundAbdomen: "/media/imaging/ultrasound-abdomen.svg",
    ultrasoundOb: "/media/imaging/ultrasound-ob.svg",
    mammography: "/media/imaging/mammography.svg",
    mriBrainPhoto: "/media/imaging/mri-brain-photo.jpg",
    ctScanPhoto: "/media/imaging/ct-scan-photo.jpg",
  },
  avatars: {
    patient214: "/media/avatars/patient-214.jpg",
    patient198: "/media/avatars/patient-198.jpg",
    patient176: "/media/avatars/patient-176.jpg",
    patient165: "/media/avatars/patient-165.jpg",
    patient142: "/media/avatars/patient-142.jpg",
    patient128: "/media/avatars/patient-128.jpg",
    patient203: "/media/avatars/patient-203.jpg",
    patient189: "/media/avatars/patient-189.jpg",
    patient155: "/media/avatars/patient-155.jpg",
    patient091: "/media/avatars/patient-091.jpg",
  },
  doctors: {
    rezaei: "/media/doctors/dr-rezaei.jpg",
    hosseini: "/media/doctors/dr-hosseini.jpg",
    mousavi: "/media/doctors/dr-mousavi.jpg",
    karimi: "/media/doctors/dr-karimi.jpg",
    akbari: "/media/doctors/dr-akbari.jpg",
    shafiei: "/media/doctors/dr-shafiei.jpg",
  },
  facility: {
    centerHall: "/media/facility/center-hall.jpg",
    mriRoom: "/media/facility/mri-room.jpg",
    reception: "/media/facility/reception.jpg",
    waitingArea: "/media/facility/waiting-area.jpg",
  },
  videos: {
    mriScanDemo: "/media/videos/mri-scan-demo.mp4",
    workflowDemo: "/media/videos/workflow-demo.mp4",
    facilityTour: "/media/videos/facility-tour.mp4",
    ultrasoundLive: "/media/videos/ultrasound-demo.mp4",
  },
  ai: {
    doctorAvatar: "/media/ai/doctor-avatar.png",
    themachineLogo: "/media/ai/themachine-logo.svg",
  },
  documents: {
    reportSample: "/media/documents/sample-report.pdf",
  },
} as const;

export type MediaKey = keyof typeof media;
