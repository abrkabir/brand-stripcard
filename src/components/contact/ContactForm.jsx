"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { contactEnquiry } from "@/data/contact";
import { siteConfig } from "@/lib/site";

/**
 * Enquiry form: name, email, message. Two fields to a row on anything wider
 * than a phone, one below.
 *
 * Every control is the underlined variant (`--line`) rather than the boxed
 * default: the form sits in an open section with no card around it, so a
 * bordered field would read as a panel inside a panel. `field--eyebrow` sets
 * the labels to match — with no box, the label is what marks the field.
 *
 * TODO: Backend — POST /api/enquiry. The success state below is optimistic;
 * surface a real error state once the endpoint exists.
 */

/** Repeated on every control, so it lives in one place. */
const FIELD = "field--eyebrow";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-start gap-3 border border-line bg-surface p-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <CheckIcon className="size-5" />
        </span>
        <p className="text-sm leading-relaxed text-content">
          <span className="font-medium text-headline">Thank you.</span> Our team
          will reply within one working day. For anything urgent, call{" "}
          <a href={siteConfig.contact.phoneHref} className="text-brand underline">
            {siteConfig.contact.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <Input
        className={FIELD}
        inputClassName="input--line"
        label="First name"
        name="firstName"
        autoComplete="given-name"
        required
      />

      <Input
        className={FIELD}
        inputClassName="input--line"
        label="Last name"
        name="lastName"
        autoComplete="family-name"
        required
      />

      {/* Full width: with the phone field gone there is nothing to pair it
          with, and a half-width email box beside empty space reads as a
          mistake. */}
      <Input
        className={`${FIELD} sm:col-span-2`}
        inputClassName="input--line"
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
      />

      <Textarea
        className={`${FIELD} sm:col-span-2`}
        textareaClassName="textarea--line"
        label="Message"
        name="message"
        rows={4}
        defaultValue={contactEnquiry.messageDraft}
        required
      />

      <Checkbox
        name="consent"
        defaultChecked
        label={<span className="text-[15px] leading-relaxed">{contactEnquiry.consent}</span>}
        className="items-start sm:col-span-2"
      />

      {/* Legal note and the button share the last row: the note reads as the
          fine print on the action rather than a footnote to the whole form. */}
      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-[13px] leading-relaxed text-muted">
          {contactEnquiry.legal}{" "}
          <a href="/privacy-policy" className="underline hover:text-brand">
            privacy policy
          </a>
          .
        </p>

        <Button type="submit" className="shrink-0">
          Send enquiry
        </Button>
      </div>
    </form>
  );
}
