"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  SelectField,
  Status,
  TextAreaField,
  TextField,
} from "@/components/dashboard/FormField";
import { Modal, ModalHead } from "@/components/dashboard/Modal";
import { Segmented } from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DollarSquareIcon,
  FacebookIcon,
  HeadsetIcon,
  HelpCircleIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  ShieldIcon,
  TicketIcon,
  UserCircleIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { dashboardUser, help } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const { contact, socials, categories, priorities, statuses } = help;

/** The icon each category's tickets show, by its `icon` name. */
const CATEGORY_ICONS = {
  card: CreditCardIcon,
  dollarSquare: DollarSquareIcon,
  userCircle: UserCircleIcon,
  shield: ShieldIcon,
  help: HelpCircleIcon,
};

/** The icon each social link shows, by its `icon` name. */
const SOCIAL_ICONS = {
  whatsapp: WhatsAppIcon,
  x: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
};

/** How each status looks: its pill. */
const STATUS_LOOK = {
  open: "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
  answered: "bg-success/12 text-success",
  closed: "bg-canvas text-muted",
};

/** How each priority's dot looks. */
const PRIORITY_DOT = {
  low: "bg-subtle",
  normal: "bg-brand-400",
  urgent: "bg-danger",
};

/** How long the demo pretends to send, in milliseconds. */
const SEND_MS = 900;

const categoryOf = (value) =>
  categories.find((c) => c.value === value) ?? categories.at(-1);
const labelOf = (list, value) =>
  list.find((item) => item.value === value)?.label;

/** When a ticket last moved, to follow "Updated": "yesterday", "2 hours ago", "14 Oct". */
const sinceText = (updated) =>
  updated.replace(/^(Yesterday|Just now|Today)/, (word) => word.toLowerCase());

/** The time now, as a thread shows it: "Today, 3:05 PM". */
const now = () =>
  `Today, ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

/** A ticket's status, as a pill. */
function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold",
        STATUS_LOOK[status],
        className,
      )}
    >
      {labelOf(statuses, status)}
    </span>
  );
}

/** A support agent's round mark: their initial on the brand colour. */
function AgentMark({ name, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white",
        className,
      )}
    >
      {name[0]}
    </span>
  );
}

/* ── A ticket ────────────────────────────────────────────────────────────── */

/**
 * A ticket, in a modal: its subject, number, category, priority and status,
 * then its thread, your messages and the team's, oldest first; under it a
 * way to reply (which puts the ticket back with the team) and to close it.
 * A closed ticket can be reopened. Mount it only while it is open.
 */
function TicketDialog({ ticket, onReply, onSetStatus, onClose }) {
  const id = useId();
  const [reply, setReply] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const endRef = useRef(null);
  const closed = ticket.status === "closed";
  const category = categoryOf(ticket.category);

  // A new message scrolls into view.
  const count = ticket.messages.length;
  const seen = useRef(count);
  useEffect(() => {
    if (seen.current === count) return;
    seen.current = count;
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [count]);

  const send = (event) => {
    event.preventDefault();
    if (reply.trim().length < 2) {
      setError("Write your reply first");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      onReply(ticket.id, reply.trim());
      setReply("");
      setBusy(false);
      setNote("Sent. We usually reply within a few hours.");
    }, SEND_MS);
  };

  return (
    <Modal
      labelledBy={`${id}-title`}
      onClose={onClose}
      className="w-[min(40rem,calc(100vw-2rem))]"
    >
      {(close) => (
        <div className="p-5 sm:p-6">
          <ModalHead
            id={`${id}-title`}
            title={ticket.subject}
            subtitle={`#${ticket.id}, ${category.label.toLowerCase()}, opened ${ticket.opened}`}
            end={<StatusPill status={ticket.status} />}
            onClose={close}
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 rounded-full",
                PRIORITY_DOT[ticket.priority],
              )}
            />
            {labelOf(priorities, ticket.priority)} priority
          </p>

          <ol aria-label="Conversation" className="mt-5 space-y-4">
            {ticket.messages.map((message, i) => {
              const mine = message.from === "me";
              return (
                <li
                  key={i}
                  className={cn(
                    "flex gap-3 motion-safe:animate-pop-in",
                    mine && "flex-row-reverse",
                  )}
                >
                  {mine ? (
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-canvas text-xs font-semibold text-headline"
                    >
                      {dashboardUser.first[0]}
                    </span>
                  ) : (
                    <AgentMark name={message.name} className="size-8" />
                  )}
                  <div
                    className={cn("max-w-[85%] min-w-0", mine && "text-right")}
                  >
                    <p className="text-xs text-muted">
                      <span className="font-semibold text-headline">
                        {mine ? "You" : `${message.name}, StripCard`}
                      </span>{" "}
                      {message.when}
                    </p>
                    <p
                      className={cn(
                        "mt-1.5 inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-relaxed text-content",
                        mine
                          ? "rounded-tr-md bg-brand-50 dark:bg-brand/10"
                          : "rounded-tl-md bg-canvas/70",
                      )}
                    >
                      {message.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div ref={endRef} />

          {closed ? (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-canvas/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                This ticket is closed. Still need help with it?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                arrow={false}
                onClick={() => {
                  onSetStatus(ticket.id, "open");
                  setNote(null);
                }}
              >
                Reopen ticket
              </Button>
            </div>
          ) : (
            <form
              onSubmit={send}
              noValidate
              className="mt-6 border-t border-line pt-5"
            >
              <TextAreaField
                label="Your reply"
                name="reply"
                rows={3}
                maxLength={600}
                placeholder="Add more details, or answer the team"
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setError(null);
                  setNote(null);
                }}
                error={error}
              />
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => onSetStatus(ticket.id, "closed")}
                  className="cursor-pointer self-start rounded-md px-1.5 py-1 text-sm font-semibold text-muted transition-colors hover:text-headline focus-visible:outline-2 focus-visible:outline-brand sm:self-auto"
                >
                  Solved? Close ticket
                </button>
                <Button
                  type="submit"
                  size="sm"
                  arrow={false}
                  disabled={busy}
                  aria-busy={busy || undefined}
                  className="disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? "Sending" : "Send reply"}
                </Button>
              </div>
              {note && (
                <Status tone="success" className="mt-3">
                  {note}
                </Status>
              )}
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ── A new ticket ────────────────────────────────────────────────────────── */

/**
 * Opening a ticket, in a modal: what it is about, how urgent it is, a
 * subject and the details. Create checks them and puts focus on what to fix,
 * then closes. Mount it only while it is open, so it starts afresh.
 */
function NewTicketDialog({ onCreate, onClose }) {
  const id = useId();
  const [form, setForm] = useState({
    category: categories[0].value,
    priority: "normal",
    subject: "",
    body: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <Modal labelledBy={`${id}-title`} onClose={onClose}>
      {(close) => {
        const submit = (event) => {
          event.preventDefault();
          const found = {};
          if (!form.subject.trim())
            found.subject = "Give your ticket a subject";
          if (form.body.trim().length < 10)
            found.body = "Tell us a little more, 10 characters or more";
          setErrors(found);
          const first = Object.keys(found)[0];
          if (first) {
            formRef.current?.elements.namedItem(first)?.focus();
            return;
          }
          setBusy(true);
          window.setTimeout(() => {
            onCreate({
              ...form,
              subject: form.subject.trim(),
              body: form.body.trim(),
            });
            close();
          }, SEND_MS);
        };

        return (
          <div className="p-5 sm:p-6">
            <ModalHead
              id={`${id}-title`}
              title="New support ticket"
              subtitle="We usually reply within a few hours"
              onClose={close}
            />
            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              className="mt-5 flex flex-col gap-4"
            >
              <SelectField
                label="About"
                value={form.category}
                onChange={set("category")}
                options={categories}
              />
              <div>
                <p className="block text-sm font-medium text-headline">
                  Priority
                </p>
                <Segmented
                  name="priority"
                  label="Priority"
                  value={form.priority}
                  onChange={set("priority")}
                  options={priorities}
                  className="mt-1.5"
                />
              </div>
              <TextField
                label="Subject"
                required
                name="subject"
                autoComplete="off"
                maxLength={80}
                placeholder="A short summary"
                data-autofocus
                value={form.subject}
                onChange={(event) => set("subject")(event.target.value)}
                error={errors.subject}
              />
              <TextAreaField
                label="Details"
                required
                name="body"
                maxLength={600}
                placeholder="What happened, and when"
                value={form.body}
                onChange={(event) => set("body")(event.target.value)}
                error={errors.body}
              />
              <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={close}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  arrow={false}
                  disabled={busy}
                  aria-busy={busy || undefined}
                  className="disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? "Creating ticket" : "Create ticket"}
                </Button>
              </div>
            </form>
          </div>
        );
      }}
    </Modal>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */

/**
 * A way to reach support, as a row: its icon, what it is, a line under it,
 * and where it leads (an off-site one opens in a new tab).
 */
function ContactRow({ icon: Icon, title, text, href, external, tile }) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-canvas/70 focus-visible:outline-2 focus-visible:outline-brand"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            tile ??
              "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
          )}
        >
          <Icon className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-sm font-semibold text-headline">
            {title}
          </span>
          <span className="mt-1 block truncate text-xs text-muted">{text}</span>
        </span>
        {external ? (
          <ArrowUpRightIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        ) : (
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5"
          />
        )}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  );
}

/** Support's ways in: email and phone, and social media. */
function SupportContacts() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5 @min-[60rem]:sticky @min-[60rem]:top-[5.75rem] @min-[60rem]:self-start">
      <Panel
        id="contact-title"
        title="Contact support"
        subtitle={contact.hours}
        icon={<HeadsetIcon className="size-[18px]" />}
      >
        <p className="flex items-center gap-2 rounded-2xl bg-success/8 px-3.5 py-2.5 text-sm font-medium text-success">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-success motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          All services are running normally
        </p>
        <ul className="mt-3 space-y-1">
          <ContactRow
            icon={MailIcon}
            title="Email us"
            text={contact.email}
            href={contact.emailHref}
          />
          <ContactRow
            icon={PhoneIcon}
            title="Call us"
            text={contact.phone}
            href={contact.phoneHref}
          />
        </ul>

        <h3 className="mt-5 text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase">
          On social media
        </h3>
        <ul className="mt-2 space-y-1">
          {socials.map((social) => (
            <ContactRow
              key={social.id}
              icon={SOCIAL_ICONS[social.icon]}
              title={social.label}
              text={social.handle}
              href={social.href}
              external
              tile="bg-canvas text-headline"
            />
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

const FILTERS = ["all", "open", "answered", "closed"];

/**
 * The Help page. Mainly the account's support tickets: filtered by where
 * they stand, each row its subject, number, category, when it last moved,
 * its priority and status (and "New reply" when the team has answered and it
 * is still to be read); a row opens its thread, to read, reply, close or
 * reopen; and a way to open a new one. Beside them, the ways to reach
 * support: email and phone, and social media.
 *
 * DEMO: nothing is sent. A new ticket or a reply waits a moment, then shows
 * here as if it went through.
 */
export function HelpCenter() {
  const [tickets, setTickets] = useState(help.tickets);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);

  const counts = Object.fromEntries(
    FILTERS.map((f) => [
      f,
      f === "all"
        ? tickets.length
        : tickets.filter((t) => t.status === f).length,
    ]),
  );
  const shown =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const openTicket = tickets.find((t) => t.id === openId);
  const active = tickets.length - counts.closed;

  const update = (id, change) =>
    setTickets((list) =>
      list.map((t) => (t.id === id ? { ...t, ...change(t) } : t)),
    );

  const open = (id) => {
    update(id, () => ({ unread: false }));
    setOpenId(id);
  };

  const reply = (id, text) =>
    update(id, (t) => ({
      status: "open",
      updated: "Just now",
      messages: [...t.messages, { from: "me", text, when: now() }],
    }));

  const setStatus = (id, status) =>
    update(id, () => ({ status, updated: "Just now" }));

  const create = ({ category, priority, subject, body }) => {
    const top = Math.max(...tickets.map((t) => Number(t.id.split("-")[1])));
    const ticket = {
      id: `SC-${top + 1}`,
      subject,
      category,
      priority,
      status: "open",
      opened: "today",
      updated: "Just now",
      messages: [{ from: "me", text: body, when: now() }],
    };
    setTickets((list) => [ticket, ...list]);
    setFilter("all");
    setCreated(ticket.id);
  };

  const filterOptions = FILTERS.map((f) => ({
    value: f,
    label: (
      <>
        {f === "all" ? "All" : labelOf(statuses, f)}
        <span className="ml-1.5 hidden text-xs font-medium text-subtle tabular-nums @min-[30rem]:inline">
          {counts[f]}
        </span>
      </>
    ),
  }));

  return (
    <div className="@container">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Panel
          id="tickets-title"
          title="Support tickets"
          subtitle={
            counts.answered
              ? `${active} active, ${counts.answered} waiting on your reply`
              : `${active} active`
          }
          icon={<TicketIcon className="size-[18px]" />}
          actions={
            <Button
              type="button"
              size="sm"
              arrow={false}
              onClick={() => setCreating(true)}
            >
              <PlusIcon aria-hidden="true" className="size-4" />
              New ticket
            </Button>
          }
        >
          <Segmented
            name="ticket-filter"
            label="Show tickets"
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />

          {created && (
            <Status tone="success" className="mt-4">
              Ticket {created} created. We will reply to {dashboardUser.email}.
            </Status>
          )}

          {shown.length ? (
            <ul className="mt-4 divide-y divide-line">
              {shown.map((ticket) => {
                const category = categoryOf(ticket.category);
                const Icon = CATEGORY_ICONS[category.icon] ?? HelpCircleIcon;
                return (
                  <li key={ticket.id} className="py-1 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => open(ticket.id)}
                      className={cn(
                        "group flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-canvas/70 focus-visible:outline-2 focus-visible:outline-brand",
                        ticket.id === created &&
                          "bg-brand-50/70 dark:bg-brand/10",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl",
                          ticket.status === "closed"
                            ? "bg-canvas text-muted"
                            : "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
                        )}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-headline">
                            {ticket.subject}
                          </span>
                          {ticket.unread && (
                            <span className="hidden @min-[30rem]:contents">
                              <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-brand px-2 text-[0.6875rem] font-semibold text-white">
                                New reply
                              </span>
                            </span>
                          )}
                        </span>
                        {/* In a narrow list: the status (and a new reply)
                            on a line of their own, under the subject. */}
                        <span className="mt-2 flex items-center gap-2 @min-[30rem]:hidden">
                          <StatusPill status={ticket.status} />
                          {ticket.unread && (
                            <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-brand px-2 text-[0.6875rem] font-semibold text-white">
                              New reply
                            </span>
                          )}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                          <span className="font-medium text-content tabular-nums">
                            #{ticket.id}
                          </span>
                          <span className="hidden items-center gap-2 @min-[30rem]:flex">
                            <span aria-hidden="true">•</span>
                            {category.label}
                          </span>
                          <span aria-hidden="true">•</span>
                          Updated {sinceText(ticket.updated)}
                        </span>
                      </span>
                      <span className="hidden w-20 shrink-0 items-center gap-1.5 text-xs text-muted @min-[36rem]:flex">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 rounded-full",
                            PRIORITY_DOT[ticket.priority],
                          )}
                        />
                        {labelOf(priorities, ticket.priority)}
                        <span className="sr-only"> priority</span>
                      </span>
                      <StatusPill
                        status={ticket.status}
                        className="hidden @min-[30rem]:inline-flex"
                      />
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="hidden size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 @min-[28rem]:block"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand dark:bg-brand/15"
              >
                <TicketIcon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-headline">
                No {labelOf(statuses, filter)?.toLowerCase()} tickets
              </p>
              <p className="mt-1 text-xs text-muted">
                Need a hand? Open a ticket and we will get back to you.
              </p>
            </div>
          )}
        </Panel>

        <SupportContacts />
      </div>

      {openTicket && (
        <TicketDialog
          key={openTicket.id}
          ticket={openTicket}
          onReply={reply}
          onSetStatus={setStatus}
          onClose={() => setOpenId(null)}
        />
      )}
      {creating && (
        <NewTicketDialog onCreate={create} onClose={() => setCreating(false)} />
      )}
    </div>
  );
}
