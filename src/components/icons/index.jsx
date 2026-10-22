/**
 * Hand-rolled 24px stroke icons — no icon dependency to install, ship or
 * tree-shake. Every icon inherits `currentColor` and sizes off `className`.
 *
 * Adding one: copy the pattern below, then register it in `icons` at the
 * bottom so data files can reference it by string name.
 */

function Svg({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5 shrink-0"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);

export const MapPinIcon = (p) => (
  <Svg {...p}>
    <path d="M20 10c0 5.2-6.3 10.6-7.5 11.6a.8.8 0 0 1-1 0C10.3 20.6 4 15.2 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (p) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const ArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Svg>
);

export const SettingsIcon = (p) => (
  <Svg {...p}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

/** An eye; `off` strikes it through. */
export const EyeIcon = ({ off, ...p }) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
    {off && <path d="m4 4 16 16" />}
  </Svg>
);

/** A cup with a handle and two curls of steam, on a saucer. */
export const CoffeeIcon = (p) => (
  <Svg {...p}>
    <path d="M4 9h12v4.5a5.5 5.5 0 0 1-5.5 5.5h-1A5.5 5.5 0 0 1 4 13.5V9Z" />
    <path d="M16 10.5h1.25a2.75 2.75 0 0 1 0 5.5H16" />
    <path d="M8 3.5c-.6.7-.6 1.8 0 2.5M12 3.5c-.6.7-.6 1.8 0 2.5" />
    <path d="M3 21.5h14" />
  </Svg>
);

/** A fuel pump with its window, and the nozzle on its hose. */
export const FuelIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16" />
    <path d="M3 21h12" />
    <rect x="6.5" y="6" width="5" height="4" rx="1" />
    <path d="M13.5 11h1.75A1.75 1.75 0 0 1 17 12.75V16a1.5 1.5 0 0 0 3 0V8.5l-2.5-2.5" />
  </Svg>
);

export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

/** A long, slim arrow: edge to edge with a small head. */
export const LongArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M2 12h20" />
    <path d="m18 8 4 4-4 4" />
  </Svg>
);

/**
 * A window with its sidebar marked, and a chevron that points the way the
 * sidebar will go: left while it is `open` (to collapse it), right while it
 * is collapsed. The chevron turns as it changes.
 */
export const SidebarIcon = ({ open, ...p }) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16" />
    <path
      d="m13.5 9.5 2.5 2.5-2.5 2.5"
      style={{
        transformBox: "fill-box",
        transformOrigin: "center",
        transform: open ? "rotate(180deg)" : "none",
        transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  </Svg>
);

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Svg>
);

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6 18 18" />
    <path d="M18 6 6 18" />
  </Svg>
);

export const SunIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const MoonIcon = (p) => (
  <Svg {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
  </Svg>
);

export const HeadsetIcon = (p) => (
  <Svg {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2Z" />
    <path d="M20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2Z" />
    <path d="M17 18c0 1.7-1.8 3-5 3" />
  </Svg>
);

export const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M6.5 3h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.6 6.6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  </Svg>
);

export const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 7.4 5a2 2 0 0 0 2.2 0l7.4-5" />
  </Svg>
);

export const BuildingIcon = (p) => (
  <Svg {...p}>
    <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
    <path d="M14 10h4a2 2 0 0 1 2 2v9" />
    <path d="M7 8h3M7 12h3M7 16h3M17 14h1M17 17h1" />
    <path d="M3 21h18" />
  </Svg>
);

export const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="m3.5 10.5 8-6.2a1 1 0 0 1 1.2 0l7.8 6.2" />
    <path d="M5.5 9.6V20h13V9.6" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);

export const KeyIcon = (p) => (
  <Svg {...p}>
    <circle cx="8" cy="14" r="4" />
    <path d="m11 11 8-8" />
    <path d="m16.5 5.5 2 2" />
    <path d="m14 8 2 2" />
  </Svg>
);

export const TicketIcon = (p) => (
  <Svg {...p}>
    <path d="M3.5 8a1.5 1.5 0 0 1 1.5-1.5h14A1.5 1.5 0 0 1 20.5 8v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16v-2a2 2 0 0 0 0-4Z" />
    <path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2" />
  </Svg>
);

export const TagIcon = (p) => (
  <Svg {...p}>
    <path d="M3.5 11.6V5a1.5 1.5 0 0 1 1.5-1.5h6.6a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8l-6.6 6.6a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1-.6-1.4Z" />
    <circle cx="8" cy="8" r="1.3" />
  </Svg>
);

export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16.5 5.2a3.4 3.4 0 0 1 0 5.6" />
    <path d="M18 14.4A6 6 0 0 1 21 20" />
  </Svg>
);

export const CreditCardIcon = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 9.5h19" />
    <path d="M6 15h4" />
  </Svg>
);

export const SlidersIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h10" />
    <path d="M18 7h2" />
    <circle cx="16" cy="7" r="2" />
    <path d="M4 17h2" />
    <path d="M10 17h10" />
    <circle cx="8" cy="17" r="2" />
  </Svg>
);

export const FilterIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5h16l-6.2 7.4V19l-3.6-1.8v-4.8Z" />
  </Svg>
);

export const GlobeIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </Svg>
);

export const ChartIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="m8 15 3.5-4 3 2.5L20 7" />
  </Svg>
);

export const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.6c0 4.2 2.8 7.6 7 9.4 4.2-1.8 7-5.2 7-9.4V6Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </Svg>
);

export const GridIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Svg>
);

export const ReceiptIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2Z" />
    <path d="M9 8.5h6M9 12h6" />
  </Svg>
);

export const GiftIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M3 9h18M12 9v11" />
    <path d="M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9Z" />
  </Svg>
);

export const BellIcon = (p) => (
  <Svg {...p}>
    <path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.5 7 2.5 7h-17S6 15 6 9.5Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Svg>
);

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
  </Svg>
);

export const LogOutIcon = (p) => (
  <Svg {...p}>
    <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </Svg>
);

export const ArrowUpRightIcon = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M8.5 7H17v8.5" />
  </Svg>
);

export const DownloadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 4v10.5M7.5 10 12 14.5 16.5 10" />
    <path d="M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
  </Svg>
);

export const UploadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 14.5V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
  </Svg>
);

export const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18Z" />
    <circle cx="12" cy="13" r="3.4" />
  </Svg>
);

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 7h15" />
    <path d="M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
    <path d="m6.5 7 .8 11.6A1.5 1.5 0 0 0 8.8 20h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    <path d="M10.5 11v5M13.5 11v5" />
  </Svg>
);

export const SwapIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8h14M14.5 4.5 18 8l-3.5 3.5" />
    <path d="M20 16H6M9.5 12.5 6 16l3.5 3.5" />
  </Svg>
);

export const BarChartIcon = (p) => (
  <Svg {...p}>
    <path d="M6 20v-6M12 20V5M18 20v-9" />
  </Svg>
);

export const HelpCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.1-2.5 3.7" />
    <path d="M12 16.9h.01" />
  </Svg>
);

/** Three stacked dots, for a handle or an overflow menu. */
export const MoreVerticalIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <circle cx="12" cy="6" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="18" r="1.6" />
  </Svg>
);

export const PlusCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8.5v7M8.5 12h7" />
  </Svg>
);

export const SendIcon = (p) => (
  <Svg {...p}>
    <path d="M20.5 3.5 10.5 13.5" />
    <path d="M20.5 3.5 14 20.5l-3.5-7-7-3.5Z" />
  </Svg>
);

export const ArrowDownCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v8M8.5 12.5 12 16l3.5-3.5" />
  </Svg>
);

export const DollarSquareIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M14.5 9.25c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.2 0 1.1-1.1 1.9-2.5 1.9-1.2 0-2.2-.6-2.6-1.6M12 6.5v1.25M12 16.25v1.25" />
  </Svg>
);

export const UserCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.6 18.4c1.2-1.9 3.1-2.9 5.4-2.9s4.2 1 5.4 2.9" />
  </Svg>
);

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <path d="M12 14.5v2" />
  </Svg>
);

export const FingerprintIcon = (p) => (
  <Svg {...p}>
    <path d="M6.5 18.5A9 9 0 0 1 5 13.5a7 7 0 0 1 12.6-4.2" />
    <path d="M19 12.5c.3 2.2 0 4.6-.8 6.6" />
    <path d="M8.8 20.2A11.5 11.5 0 0 1 8 13.5a4 4 0 0 1 8 0c0 1.4-.1 2.8-.4 4.1" />
    <path d="M12 13.5c0 3-.6 5.6-1.6 7.5" />
    <path d="M14.4 20.4c.3-.7.5-1.4.7-2.2" />
  </Svg>
);

export const IdCardIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="8.5" cy="10.5" r="2" />
    <path d="M5.8 15.5c.6-1.2 1.6-1.9 2.7-1.9s2.1.7 2.7 1.9" />
    <path d="M14 10h4M14 13.5h3" />
  </Svg>
);

export const PassportIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10.5" r="3.2" />
    <path d="M8.8 10.5h6.4" />
    <path d="M12 7.3c-.9.9-1.4 2-1.4 3.2s.5 2.3 1.4 3.2c.9-.9 1.4-2 1.4-3.2S12.9 8.2 12 7.3Z" />
    <path d="M9.5 17.5h5" />
  </Svg>
);

export const SmartphoneIcon = (p) => (
  <Svg {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </Svg>
);

export const CopyIcon = (p) => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" />
    <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
  </Svg>
);

export const FileIcon = (p) => (
  <Svg {...p}>
    <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3.5V8h4.5" />
    <path d="M9 13h6M9 16.5h4" />
  </Svg>
);

export const ScanFaceIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M9 9.5v1M15 9.5v1" />
    <path d="M12 9.5V13h-1" />
    <path d="M9.5 15.5a3.5 3.5 0 0 0 5 0" />
  </Svg>
);

export const InfoIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.8h.01" strokeWidth={2.4} />
  </Svg>
);

export const SparklesIcon = (p) => (
  <Svg {...p}>
    <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z" />
    <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
  </Svg>
);

export const HeartIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20.2 4.3 12.6a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1.2 1.2 1.2-1.2a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.5Z" />
  </Svg>
);

export const StarIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="m12 3.6 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8Z" />
  </Svg>
);

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const BedIcon = (p) => (
  <Svg {...p}>
    <path d="M3 18v-8" />
    <path d="M3 13h18a0 0 0 0 1 0 0v5" />
    <path d="M7 13v-2.5A1.5 1.5 0 0 1 8.5 9h8a1.5 1.5 0 0 1 1.5 1.5V13" />
    <path d="M3 18h18" />
  </Svg>
);

export const BathIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12V6.5A2.5 2.5 0 0 1 8.75 5.4" />
    <path d="M7.5 7.5h3" />
    <path d="M2.5 12h19v1.5a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5Z" />
    <path d="M6.5 18.5 5.5 21M17.5 18.5l1 2.5" />
  </Svg>
);

export const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Svg>
);

export const LayersIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3 3 7.5 12 12l9-4.5Z" />
    <path d="M3 12.5 12 17l9-4.5" />
    <path d="M3 17.5 12 22l9-4.5" />
  </Svg>
);

export const CarIcon = (p) => (
  <Svg {...p}>
    <path d="M4 16v-3.2L6 8h12l2 4.8V16" />
    <path d="M2.5 16h19" />
    <circle cx="7.5" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </Svg>
);

export const SofaIcon = (p) => (
  <Svg {...p}>
    <path d="M4 13V8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5V13" />
    <path d="M2.5 14.5a1.8 1.8 0 0 1 3.6 0V18h11.8v-3.5a1.8 1.8 0 0 1 3.6 0V18a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z" />
  </Svg>
);

export const CompassIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5.2-5.2 2 2-5.2Z" />
  </Svg>
);

export const RulerIcon = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="8.5" width="19" height="7" rx="1.6" />
    <path d="M7 8.5v3M11 8.5v2M15 8.5v3M19 8.5v2" />
  </Svg>
);

export const PlayIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M8.5 5.6a1 1 0 0 1 1.5-.9l8 6.4a1 1 0 0 1 0 1.8l-8 6.4a1 1 0 0 1-1.5-.9Z" />
  </Svg>
);

/**
 * Language / translate glyph. Filled rather than stroked so it stays legible
 * at the 16px the header uses it at.
 */
export const TranslateIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M12.87 15.07l-2.54-2.51.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17A15.4 15.4 0 0 1 9 11.35 15.6 15.6 0 0 1 6.69 8h-2a17.8 17.8 0 0 0 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04ZM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12Zm-2.62 7 1.62-4.33L19.12 17h-3.24Z" />
  </Svg>
);

/**
 * The wordmark's diagonal, reused as a CTA marker — a small parallelogram that
 * slides on hover. Not on the 24px grid, so it declares its own viewBox.
 */
export const SlashMarkIcon = (props) => (
  <svg
    viewBox="0 0 26 10"
    fill="currentColor"
    aria-hidden="true"
    className="h-2.5 w-[26px] shrink-0"
    {...props}
  >
    <path d="M6.5 0H26l-6.5 10H0z" />
  </svg>
);

/* ── Brand marks — solid, no stroke ──────────────────────────────────────── */

export const WhatsAppIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.33 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23a8.18 8.18 0 0 1 8.24 8.24c0 4.54-3.7 8.21-8.25 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5l.37-.43c.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
  </Svg>
);

export const FacebookIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.7c0-.9.3-1.5 1.6-1.5H17V4.6A21 21 0 0 0 14.6 4.5c-2.4 0-4 1.4-4 4v2H8v3h2.6V21Z" />
  </Svg>
);

export const InstagramIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </Svg>
);

export const XIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M17.3 3h3.1l-6.8 7.8L21.7 21h-6.2l-4.9-6.4L4.9 21H1.8l7.3-8.3L2.1 3h6.4l4.4 5.8Zm-1.1 16.1h1.7L7.9 4.8H6Z" />
  </Svg>
);

export const AppleIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.8ZM14 5.4c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3Z" />
  </Svg>
);

export const GooglePlayIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M3.6 2.3c-.2.2-.3.5-.3.9v17.6c0 .4.1.7.3.9l.1.1 9.9-9.9v-.2L3.7 2.2Z" />
    <path d="m16.9 15.2-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2Z" opacity=".75" />
    <path d="m17 15.1-3.4-3.4-10 10c.4.4 1 .4 1.7.1L17 15.1" opacity=".55" />
    <path d="M17 8.5 5.3 1.9c-.7-.4-1.3-.3-1.7.1l10 10Z" opacity=".85" />
  </Svg>
);

export const LinkedInIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M6.9 8.7v11.4H3.4V8.7ZM5.15 3.4a2 2 0 1 1 0 4.1 2 2 0 0 1 0-4.1ZM9.2 8.7h3.4v1.6a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4.2 2.3 4.2 5.3v6.3h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2Z" />
  </Svg>
);

export const YouTubeIcon = (p) => (
  <Svg fill="currentColor" stroke="none" {...p}>
    <path d="M22 12s0-3.3-.4-4.9a2.6 2.6 0 0 0-1.8-1.8C18.2 4.9 12 4.9 12 4.9s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8C2 8.7 2 12 2 12s0 3.3.4 4.9a2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.9.4-4.9ZM10 15.2V8.8l5.4 3.2Z" />
  </Svg>
);

/* ── Registry ────────────────────────────────────────────────────────────── */
/* Lets data files stay plain serialisable objects: `icon: "building"`.       */

export const icons = {
  search: SearchIcon,
  mapPin: MapPinIcon,
  chevronDown: ChevronDownIcon,
  chevronRight: ChevronRightIcon,
  arrowRight: ArrowRightIcon,
  plus: PlusIcon,
  menu: MenuIcon,
  sidebar: SidebarIcon,
  close: CloseIcon,
  sun: SunIcon,
  moon: MoonIcon,
  headset: HeadsetIcon,
  phone: PhoneIcon,
  mail: MailIcon,
  building: BuildingIcon,
  home: HomeIcon,
  key: KeyIcon,
  tag: TagIcon,
  ticket: TicketIcon,
  users: UsersIcon,
  card: CreditCardIcon,
  globe: GlobeIcon,
  sliders: SlidersIcon,
  filter: FilterIcon,
  chart: ChartIcon,
  shield: ShieldIcon,
  lock: LockIcon,
  camera: CameraIcon,
  trash: TrashIcon,
  fingerprint: FingerprintIcon,
  idCard: IdCardIcon,
  passport: PassportIcon,
  smartphone: SmartphoneIcon,
  copy: CopyIcon,
  file: FileIcon,
  scanFace: ScanFaceIcon,
  info: InfoIcon,
  sparkles: SparklesIcon,
  star: StarIcon,
  heart: HeartIcon,
  check: CheckIcon,
  bed: BedIcon,
  bath: BathIcon,
  ruler: RulerIcon,
  calendar: CalendarIcon,
  layers: LayersIcon,
  car: CarIcon,
  sofa: SofaIcon,
  compass: CompassIcon,
  play: PlayIcon,
  translate: TranslateIcon,
  slashMark: SlashMarkIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  whatsapp: WhatsAppIcon,
};

export function getIcon(name) {
  if (!name) return null;
  return icons[name] ?? null;
}
