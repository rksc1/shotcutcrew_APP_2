// ─── Booking Event Categories ──────────────────────────────────────────────
export const CUSTOM_EVENT_TYPE_ID = "custom_requirement";

export type BookingOption = {
  id: string;
  label: string;
  description?: string;
  icon?: string; // emoji icon for mobile
};

export type BookingCategory = {
  id: string;
  label: string;
  emoji: string;
  options: BookingOption[];
};

export const BOOKING_EVENT_CATEGORIES: BookingCategory[] = [
  {
    id: "weddings_personal",
    label: "Weddings & Personal",
    emoji: "💍",
    options: [
      { id: "wedding", label: "Wedding" },
      { id: "pre_wedding", label: "Pre Wedding" },
      { id: "engagement", label: "Engagement" },
      { id: "birthday_party", label: "Birthday Party" },
      { id: "anniversary", label: "Anniversary" },
      { id: "baby_shower", label: "Baby Shower" },
      { id: "maternity_shoot", label: "Maternity Shoot" },
      { id: "family_shoot", label: "Family Shoot" },
    ],
  },
  {
    id: "commercial_brand",
    label: "Commercial & Brand",
    emoji: "🎯",
    options: [
      { id: "product_shoot", label: "Product Shoot" },
      { id: "e_commerce_shoot", label: "E-commerce Shoot" },
      { id: "commercial_ad", label: "Commercial Ad" },
      { id: "brand_campaign", label: "Brand Campaign" },
      { id: "fashion_shoot", label: "Fashion Shoot" },
      { id: "food_photography", label: "Food Photography" },
      { id: "restaurant_shoot", label: "Restaurant Shoot" },
      { id: "real_estate_shoot", label: "Real Estate Shoot" },
      { id: "automobile_shoot", label: "Automobile Shoot" },
    ],
  },
  {
    id: "corporate_professional",
    label: "Corporate & Professional",
    emoji: "🏢",
    options: [
      { id: "corporate_event", label: "Corporate Event" },
      { id: "conference", label: "Conference" },
      { id: "seminar", label: "Seminar" },
      { id: "award_show", label: "Award Show" },
      { id: "company_profile_shoot", label: "Company Profile Shoot" },
      { id: "interview_shoot", label: "Interview Shoot" },
      { id: "linkedin_professional_portrait", label: "LinkedIn Portrait" },
    ],
  },
  {
    id: "entertainment_media",
    label: "Entertainment & Media",
    emoji: "🎬",
    options: [
      { id: "music_video", label: "Music Video" },
      { id: "short_film", label: "Short Film" },
      { id: "documentary", label: "Documentary" },
      { id: "podcast_shoot", label: "Podcast Shoot" },
      { id: "youtube_content", label: "YouTube Content" },
      { id: "ott_web_series", label: "OTT / Web Series" },
      { id: "film_production", label: "Film Production" },
      { id: "live_performance", label: "Live Performance" },
    ],
  },
  {
    id: "social_creator",
    label: "Social Media & Creator",
    emoji: "📱",
    options: [
      { id: "instagram_reel_shoot", label: "Instagram Reel" },
      { id: "influencer_collaboration", label: "Influencer Collab" },
      { id: "content_creation", label: "Content Creation" },
      { id: "youtube_vlog", label: "YouTube Vlog" },
      { id: "livestream_production", label: "Livestream" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    emoji: "✏️",
    options: [{ id: CUSTOM_EVENT_TYPE_ID, label: "Custom Requirement" }],
  },
];

export const BOOKING_CREW_CATEGORIES: BookingCategory[] = [
  {
    id: "photography",
    label: "Photography",
    emoji: "📷",
    options: [
      { id: "photographer", label: "Photographer", description: "Captures still images" },
      { id: "assistant_photographer", label: "Asst. Photographer", description: "Backup and support" },
    ],
  },
  {
    id: "video",
    label: "Video",
    emoji: "🎥",
    options: [
      { id: "videographer", label: "Videographer", description: "Video coverage" },
      { id: "camera_operator", label: "Camera Operator", description: "Dedicated camera" },
      { id: "assistant_cameraman", label: "Asst. Camera", description: "Camera support" },
    ],
  },
  {
    id: "drone",
    label: "Drone",
    emoji: "🚁",
    options: [
      { id: "drone_operator", label: "Drone Operator", description: "Aerial coverage" },
    ],
  },
  {
    id: "audio",
    label: "Audio",
    emoji: "🎙️",
    options: [
      { id: "sound_engineer", label: "Sound Engineer", description: "Production sound" },
      { id: "boom_operator", label: "Boom Operator", description: "Mic placement" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    emoji: "💡",
    options: [
      { id: "lighting_technician", label: "Lighting Technician", description: "Light setup" },
      { id: "gaffer", label: "Gaffer", description: "Leads lighting" },
    ],
  },
  {
    id: "production",
    label: "Production",
    emoji: "🎭",
    options: [
      { id: "director", label: "Director", description: "Creative lead" },
      { id: "creative_director", label: "Creative Director", description: "Visual direction" },
      { id: "production_manager", label: "Production Manager", description: "Logistics" },
      { id: "production_assistant", label: "Production Asst.", description: "On-ground support" },
    ],
  },
  {
    id: "post_production_crew",
    label: "Post Production",
    emoji: "✂️",
    options: [
      { id: "photo_editor", label: "Photo Editor", description: "Image editing" },
      { id: "video_editor", label: "Video Editor", description: "Video cutting" },
      { id: "color_grading_artist", label: "Colorist", description: "Color grading" },
      { id: "motion_graphics_artist", label: "Motion Graphics", description: "Animated graphics" },
      { id: "vfx_artist", label: "VFX Artist", description: "Visual effects" },
    ],
  },
  {
    id: "beauty",
    label: "Hair & Makeup",
    emoji: "💄",
    options: [
      { id: "makeup_artist", label: "Makeup Artist", description: "Talent makeup" },
      { id: "hair_stylist", label: "Hair Stylist", description: "Hair styling" },
    ],
  },
  {
    id: "specialized",
    label: "Specialized",
    emoji: "🎧",
    options: [
      { id: "script_writer", label: "Script Writer", description: "Script and copy" },
      { id: "teleprompter_operator", label: "Teleprompter Op.", description: "Prompting" },
      { id: "livestream_operator", label: "Livestream Op.", description: "Broadcast" },
    ],
  },
];

export const EQUIPMENT_REQUIREMENT_CATEGORIES: BookingCategory[] = [
  {
    id: "camera",
    label: "Camera",
    emoji: "📷",
    options: [
      { id: "camera", label: "Camera" },
      { id: "lens_kit", label: "Lens Kit" },
      { id: "tripod", label: "Tripod" },
      { id: "gimbal", label: "Gimbal" },
      { id: "monitor", label: "Monitor" },
      { id: "slider", label: "Slider" },
      { id: "dolly", label: "Dolly" },
      { id: "jib_crane", label: "Jib / Crane" },
    ],
  },
  {
    id: "lighting_eq",
    label: "Lighting",
    emoji: "💡",
    options: [
      { id: "led_lights", label: "LED Lights" },
      { id: "rgb_lights", label: "RGB Lights" },
      { id: "softbox", label: "Softbox" },
      { id: "reflector", label: "Reflector" },
      { id: "c_stand", label: "C-Stand" },
      { id: "power_extension", label: "Power Extension" },
    ],
  },
  {
    id: "audio_eq",
    label: "Audio",
    emoji: "🎙️",
    options: [
      { id: "mic_setup", label: "Mic Setup" },
      { id: "wireless_mic", label: "Wireless Mic" },
      { id: "boom_mic", label: "Boom Mic" },
      { id: "audio_recorder", label: "Audio Recorder" },
    ],
  },
  {
    id: "drone_eq",
    label: "Drone",
    emoji: "🚁",
    options: [
      { id: "drone", label: "Drone" },
      { id: "fpv_drone", label: "FPV Drone" },
    ],
  },
  {
    id: "broadcast",
    label: "Broadcast",
    emoji: "📺",
    options: [
      { id: "teleprompter", label: "Teleprompter" },
      { id: "livestream_setup", label: "Livestream Setup" },
      { id: "atem_switcher", label: "ATEM Switcher" },
      { id: "capture_card", label: "Capture Card" },
    ],
  },
  {
    id: "production_eq",
    label: "Production",
    emoji: "📦",
    options: [
      { id: "green_screen", label: "Green Screen" },
      { id: "smoke_machine", label: "Smoke Machine" },
      { id: "props", label: "Props" },
      { id: "makeup_setup", label: "Makeup Setup" },
      { id: "generator", label: "Generator" },
    ],
  },
];

export const POST_PRODUCTION_OPTIONS = [
  { id: "editing", label: "Editing", emoji: "✂️" },
  { id: "photo_retouching", label: "Photo Retouching", emoji: "🖼️" },
  { id: "color_grading", label: "Color Grading", emoji: "🎨" },
  { id: "thumbnail_design", label: "Thumbnail Design", emoji: "🖼️" },
  { id: "motion_graphics", label: "Motion Graphics", emoji: "🎞️" },
  { id: "vfx", label: "VFX", emoji: "✨" },
  { id: "sound_design", label: "Sound Design", emoji: "🔊" },
  { id: "voiceover", label: "Voiceover", emoji: "🎤" },
  { id: "subtitles", label: "Subtitles", emoji: "📝" },
  { id: "social_media_cutdowns", label: "Social Cutdowns", emoji: "📱" },
  { id: "trailer_teaser", label: "Trailer / Teaser", emoji: "🎬" },
  { id: "data_backup", label: "Data Backup", emoji: "💾" },
];

export const BUDGET_TIER_OPTIONS = [
  {
    id: "budget",
    label: "Budget",
    description: "Best for simple shoots",
    emoji: "💰",
    range: "₹5K – ₹25K",
  },
  {
    id: "standard",
    label: "Standard",
    description: "Best balance of quality and price",
    emoji: "⭐",
    badge: "Recommended",
    range: "₹25K – ₹1L",
  },
  {
    id: "premium",
    label: "Premium",
    description: "Top creators, strongest production",
    emoji: "👑",
    range: "₹1L+",
  },
] as const;

export type BudgetTier = (typeof BUDGET_TIER_OPTIONS)[number]["id"];

// ─── Cities ────────────────────────────────────────────────────────────────
export const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Chandigarh", "Indore", "Bhopal", "Kochi",
];

// ─── Project Status Labels ──────────────────────────────────────────────────
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  draft:            "Draft",
  pending_review:   "Under Review",
  confirmed:        "Confirmed",
  pending_payment:  "Awaiting Payment",
  in_progress:      "In Progress",
  delivered:        "Delivered",
  completed:        "Completed",
  cancelled:        "Cancelled",
  expired:          "Expired",
  payout_ready:     "Payout Ready",
  payout_completed: "Payout Done",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  draft:            "bg-dark-500 text-text-secondary",
  pending_review:   "bg-warning/20 text-warning",
  confirmed:        "bg-info/20 text-info",
  pending_payment:  "bg-accent-500/20 text-accent-500",
  in_progress:      "bg-brand-500/20 text-brand-400",
  delivered:        "bg-success/20 text-success",
  completed:        "bg-success/20 text-success",
  cancelled:        "bg-error/20 text-error",
  expired:          "bg-dark-500 text-text-muted",
  payout_ready:     "bg-success/20 text-success",
  payout_completed: "bg-dark-500 text-text-secondary",
};

// ─── Helper Functions ───────────────────────────────────────────────────────
export function getEventTypeLabel(eventType: string, customEventType?: string | null) {
  if (eventType === CUSTOM_EVENT_TYPE_ID) return customEventType?.trim() || "Custom Requirement";
  const all = BOOKING_EVENT_CATEGORIES.flatMap((c) => c.options);
  return all.find((o) => o.id === eventType)?.label || eventType.replace(/_/g, " ");
}

export function getCrewRequirementSummary(crewRequirements: Record<string, number>) {
  return BOOKING_CREW_CATEGORIES
    .flatMap((c) => c.options)
    .filter((o) => Number(crewRequirements[o.id] || 0) > 0)
    .map((o) => `${crewRequirements[o.id]}x ${o.label}`)
    .join(", ");
}
