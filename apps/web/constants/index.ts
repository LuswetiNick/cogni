import {
  ConnectIcon,
  CreditCardIcon,
  InboxIcon,
  LibraryIcon,
  PaintBoardIcon,
  VoiceIcon,
} from "@hugeicons/core-free-icons";

export const sidebardata = {
  sidebarLinks: [
    {
      title: "Customer Support",
      items: [
        {
          title: "Conversations",
          url: "/dashboard/conversations",
          icon: InboxIcon,
        },
        {
          title: "Knowledge Base",
          url: "/dashboard/knowledge-base",
          icon: LibraryIcon,
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Widget Customization",
          url: "/dashboard/widget",
          icon: PaintBoardIcon,
        },
        {
          title: "Integrations",
          url: "/dashboard/integrations",
          icon: ConnectIcon,
        },
        {
          title: "Voice Assistant",
          url: "/dashboard/voice-assistant",
          icon: VoiceIcon,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Plans & Billing",
          url: "/dashboard/billing",
          icon: CreditCardIcon,
        },
      ],
    },
  ],
};

export const STATUS_FILTER_KEY = "cogni-status-filter";
