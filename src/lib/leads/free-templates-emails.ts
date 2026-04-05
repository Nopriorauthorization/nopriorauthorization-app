import { FREE_TEMPLATES_LEAD_MAGNET } from "@/config/free-templates-lead-magnet.config";
import { marketingSiteOrigin } from "@/lib/leads/marketing-site-origin";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, " ");
}

function leadEmailShell(body: string, footerNote: string, unsubscribeUrl: string): string {
  const origin = marketingSiteOrigin();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#f5f3f1;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3f1;padding:24px 12px"><tr><td align="center">
<table width="100%" style="max-width:560px;background:#fff;border-radius:8px;border:1px solid rgba(26,26,26,0.08)"><tr><td style="padding:28px 24px 20px;border-bottom:3px solid #D4537E">
<p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#D4537E;font-family:system-ui,sans-serif">No Prior Authorization</p>
</td></tr><tr><td style="padding:24px;font-size:16px;line-height:1.65;color:#333">
${body}
</td></tr><tr><td style="padding:16px 24px 24px;border-top:1px solid #eee;font-size:12px;color:#888;font-family:system-ui,sans-serif;line-height:1.5">
<p style="margin:0 0 8px">${footerNote}</p>
<p style="margin:0"><a href="${unsubscribeUrl}" style="color:#D4537E;font-weight:600">Unsubscribe</a> from these follow-ups anytime.</p>
</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#aaa;font-family:system-ui,sans-serif">${origin}</p>
</td></tr></table></body></html>`;
}

export function buildFreeTemplatesDeliveryEmail(opts: {
  firstName: string;
  email: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const origin = marketingSiteOrigin();
  const fn = escapeHtml(opts.firstName.trim() || "there");
  const deliveryUrl = `${origin}/free-templates/downloads`;

  const listItems = FREE_TEMPLATES_LEAD_MAGNET.map(
    (row, i) =>
      `<li style="margin:0 0 8px;padding-left:4px"><strong>${i + 1}.</strong> ${escapeHtml(row.label)}</li>`,
  ).join("");

  const inner = `<p style="margin:0 0 16px">Hi ${fn},</p>
<p style="margin:0 0 16px">I'm so glad you're here.</p>
<p style="margin:0 0 16px">Your 10 free templates are ready — no catch, no expiration, just yours:</p>
<ol style="margin:0 0 20px;padding-left:22px;color:#333">${listItems}</ol>
<p style="margin:0 0 8px;font-size:17px;line-height:1.5">→ <a href="${deliveryUrl}" style="color:#D4537E;font-weight:700">Download all 10 here</a></p>
<p style="margin:0 0 20px;font-size:13px;color:#666;word-break:break-all">${deliveryUrl}</p>
<p style="margin:0 0 16px">Every one of these was built from something I learned the hard way in 10 years running Hello Gorgeous Med Spa in Oswego, IL. I made the mistakes so you don't have to.</p>
<p style="margin:0 0 16px">If one of these saves you even one awkward patient conversation or helps you feel more prepared walking into a treatment room — it was worth building.</p>
<p style="margin:0 0 16px">Hit reply and tell me which one you needed most. I read every response.</p>
<p style="margin:0 0 24px">More coming your way later this week. 🤍</p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#333">— Danielle Alcala<br/>
<span style="font-size:14px;color:#555">Founder, Hello Gorgeous Med Spa + No Prior Authorization</span><br/>
<a href="${origin}" style="color:#D4537E;font-weight:600;text-decoration:none">${origin.replace(/^https:\/\//, "")}</a></p>`;

  return {
    subject: `Here are your 10 free templates, ${opts.firstName.trim() || "there"} 🤍`,
    html: leadEmailShell(
      inner,
      "You're receiving this because you requested the free template pack at nopriorauthorization.com.",
      opts.unsubscribeUrl,
    ),
  };
}

/** Day 1 after signup — placeholder; replace body when final copy arrives. */
export function buildFreeTemplatesNurtureDay1Email(opts: {
  firstName: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const origin = marketingSiteOrigin();
  const fn = escapeHtml(opts.firstName.trim() || "there");
  const inner = `<p style="margin:0 0 16px">Hi ${fn} — Danielle here 🤍</p>
<p style="margin:0 0 16px">Quick check-in: did you get a chance to open any of the 10 templates yet? Even skimming one on your phone counts — I just want to make sure nothing landed in spam.</p>
<p style="margin:0 0 16px">If you're an esthetician or injector training your room, the <strong>Complete Facial Training Manual</strong> is the best $10 next step after those freebies — full consult framework, 60-minute facial protocol, and staff training cues in one HTML download.</p>
<p style="margin:0"><a href="${origin}/shop/facial-training-manual" style="color:#D4537E;font-weight:600">See the Facial Training Manual ($10) →</a></p>`;
  return {
    subject: `Did you get a chance to open your templates?`,
    html: leadEmailShell(inner, "Follow-up 1 of 3 from your free template signup.", opts.unsubscribeUrl),
  };
}

/** Day 3 — Injection Techniques Cheat Sheet (nurture). */
export function buildFreeTemplatesNurtureDay3Email(opts: {
  firstName: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const origin = marketingSiteOrigin();
  const fn = escapeHtml(opts.firstName.trim() || "there");
  const sheetUrl = `${origin}/shop/injection-techniques-cheat-sheet`;
  const inner = `<p style="margin:0 0 16px">Hi ${fn},</p>
<p style="margin:0 0 16px">Every week in med spa provider groups someone asks some version of this:</p>
<p style="margin:0 0 16px;font-style:italic;color:#444">"What's the difference between subcutaneous and intramuscular injection — and how do I know which to use?"</p>
<p style="margin:0 0 16px">It's a great question. And the answer matters more than most people realize.</p>
<p style="margin:0 0 16px">The wrong route = wrong absorption rate, wrong onset, wrong result. And in some cases — a real safety issue.</p>
<p style="margin:0 0 16px">So I built the answer into one cheat sheet.</p>
<p style="margin:0 0 12px">The <strong>Injection Techniques Cheat Sheet</strong> covers all 5 routes — transdermal, intradermal, subcutaneous, intramuscular, and intravenous — side by side:</p>
<ul style="margin:0 0 18px;padding-left:20px;line-height:1.55;list-style:none">
<li style="margin:0 0 6px;padding-left:0">✓ Needle gauge and length for each route</li>
<li style="margin:0 0 6px">✓ Correct angle and depth</li>
<li style="margin:0 0 6px">✓ When to aspirate (and when current guidelines say you don't need to)</li>
<li style="margin:0 0 6px">✓ IM site landmarks — deltoid, ventrogluteal, vastus lateralis</li>
<li style="margin:0 0 6px">✓ Z-track technique — when and exactly how</li>
<li style="margin:0 0 6px">✓ Complication recognition and response including anaphylaxis protocol</li>
</ul>
<p style="margin:0 0 16px">It's $17 and it's the one clinical reference I'd want printed and posted in every injection room.</p>
<p style="margin:0 0 8px;font-size:17px;line-height:1.5">→ <a href="${sheetUrl}" style="color:#D4537E;font-weight:700">Get the Injection Techniques Cheat Sheet</a></p>
<p style="margin:0 0 20px;font-size:13px;color:#666;word-break:break-all"><a href="${sheetUrl}" style="color:#666">${sheetUrl.replace(/^https:\/\//, "")}</a></p>
<p style="margin:0 0 20px">More than 34 cheat sheets live on the site now — all built from real clinical practice, not textbooks.</p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#333">— Danielle 🤍<br/>
<a href="${origin}" style="color:#D4537E;font-weight:600;text-decoration:none">${origin.replace(/^https:\/\//, "")}</a></p>`;
  return {
    subject: `The question I get asked most in med spa Facebook groups...`,
    html: leadEmailShell(inner, "Follow-up 2 of 3 from your free template signup.", opts.unsubscribeUrl),
  };
}

/** Day 7 — Med Spa Starter Kit ($59) */
export function buildFreeTemplatesNurtureDay7Email(opts: {
  firstName: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const origin = marketingSiteOrigin();
  const fn = escapeHtml(opts.firstName.trim() || "there");
  const kitUrl = `${origin}/shop/med-spa-starter-kit`;
  const host = origin.replace(/^https:\/\//, "");
  const inner = `<p style="margin:0 0 16px">Hi ${fn},</p>
<p style="margin:0 0 16px">The day I opened Hello Gorgeous Med Spa, I stood in an empty treatment room and thought:</p>
<p style="margin:0 0 16px;font-style:italic;color:#444">"Now what?"</p>
<p style="margin:0 0 16px">I had my license. I had the equipment. I had the passion — all of it.</p>
<p style="margin:0 0 16px">What I didn't have was anyone who had done this before telling me what to do first.</p>
<p style="margin:0 0 16px">So I figured it out. Slowly. Painfully. Expensively.</p>
<p style="margin:0 0 16px">I underpriced my services for two years because I didn't know how to calculate my actual cost of goods. I didn't have a real system for asking patients for reviews — so I just hoped they'd leave one. My first consent forms were... not what they should have been.</p>
<p style="margin:0 0 16px">Ten years later, Hello Gorgeous is the #1 rated med spa in Oswego, IL. 4.9 stars. $500K+ in equipment. A team I'm genuinely proud of.</p>
<p style="margin:0 0 16px">And I built No Prior Authorization because I wanted to hand you the playbook I didn't have.</p>
<p style="margin:0 0 16px">The <strong>Med Spa Starter Kit</strong> is the front door to all of it.</p>
<p style="margin:0 0 12px"><strong>For $59 you get:</strong></p>
<ul style="margin:0 0 20px;padding-left:0;line-height:1.6;list-style:none">
<li style="margin:0 0 10px">→ The 90-Day Week-by-Week Launch Roadmap — exactly what to do, in order, from license to first patient</li>
<li style="margin:0 0 10px">→ The Business Setup Checklist — LLC, EIN, insurance, permits, booking system</li>
<li style="margin:0 0 10px">→ Your First 5 Services Pricing Workbook — know your numbers, price with confidence</li>
<li style="margin:0 0 10px">→ The First 30 Patients Playbook — how to get patients before you have reviews or reputation</li>
<li style="margin:0 0 10px">→ 30 Days of Pre-Launch Social Content — written and ready to post</li>
<li style="margin:0 0 10px">→ Danielle's Opening Day Letter — the one page I would hand my Year One self</li>
</ul>
<p style="margin:0 0 20px">If you're building a practice right now — or dreaming about it — this is where I'd start.</p>
<p style="margin:0 0 8px;font-size:17px;line-height:1.5">→ <a href="${kitUrl}" style="color:#D4537E;font-weight:700">Get the Med Spa Starter Kit for $59</a></p>
<p style="margin:0 0 24px;font-size:13px;color:#666;word-break:break-all"><a href="${kitUrl}" style="color:#666">${host}/shop/med-spa-starter-kit</a></p>
<p style="margin:0 0 16px">And as always — hit reply anytime. I'm a real person and I read every email. 🤍</p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#333">— Danielle Alcala<br/>
<span style="font-size:14px;color:#555">Founder, Hello Gorgeous Med Spa + No Prior Authorization</span><br/>
<a href="${origin}" style="color:#D4537E;font-weight:600;text-decoration:none">${host}</a></p>
<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #eee;font-size:14px;line-height:1.6;color:#555">
<strong>P.S.</strong> If the free templates I sent were useful — the full catalog has 34 clinical cheat sheets, 10 patient handouts, consent forms, anatomy guides, reputation systems, and more. All at <a href="${origin}/shop" style="color:#D4537E;font-weight:600">${host}/shop</a>.
</p>`;
  return {
    subject: `What I wish someone had handed me on Day One...`,
    html: leadEmailShell(inner, "Follow-up 3 of 3 from your free template signup.", opts.unsubscribeUrl),
  };
}

export function buildNurtureEmailForStep(
  stepIndex0: number,
  opts: { firstName: string; unsubscribeUrl: string },
): { subject: string; html: string } {
  if (stepIndex0 === 0) return buildFreeTemplatesNurtureDay1Email(opts);
  if (stepIndex0 === 1) return buildFreeTemplatesNurtureDay3Email(opts);
  return buildFreeTemplatesNurtureDay7Email(opts);
}
