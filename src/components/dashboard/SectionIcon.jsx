import {
  ArrowDownCircleIcon,
  CreditCardIcon,
  DollarSquareIcon,
  GiftIcon,
  HomeIcon,
  LockIcon,
  PlusCircleIcon,
  SendIcon,
  ShieldIcon,
  UserCircleIcon,
} from "@/components/icons";

/** The icon for each dashboard page, by the `icon` name in data/dashboard.js. */
const ICONS = {
  home: HomeIcon,
  plusCircle: PlusCircleIcon,
  send: SendIcon,
  arrowDownCircle: ArrowDownCircleIcon,
  card: CreditCardIcon,
  gift: GiftIcon,
  dollarSquare: DollarSquareIcon,
  userCircle: UserCircleIcon,
  shield: ShieldIcon,
  lock: LockIcon,
};

/** A dashboard page's icon, shared by the sidebar and the pages themselves. */
export function SectionIcon({ name, ...props }) {
  const Icon = ICONS[name];
  return Icon ? <Icon aria-hidden="true" {...props} /> : null;
}
