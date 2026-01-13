# Why We Moved Sciorex Off GitHub

Sciorex is not a fully open source project. Some parts of the ecosystem are public, such as the VSCode bridge, community agents, flows, and extensions, because they benefit from being shared and reused. **The core application itself is private**, and nothing that happened here was the result of spam, abuse, or an attempt to game GitHub systems.

This post exists because something unexpected happened, and because after more than ten days, **we still do not have an explanation.**

---

## What Happened

A little over a week ago, while preparing a new release, our GitHub workflows were suddenly cancelled. The message we saw was that the account owner had been marked as spam.

> **There was no warning beforehand. No email. No notification.** Nothing in the GitHub UI explaining what triggered it or what we were supposed to do next.

We can still log into the account, but the profile is only visible to us while logged in. To everyone else, it simply does not exist. Our repositories are not visible, our contributions appear gone, and from the outside it looks like the project vanished entirely.

---

## The Reinstatement Request

Naturally, we opened a reinstatement request.

In it, we explained what we had done: publishing a new tag, triggering automated workflows, and pushing a release. One of the messages we received during this process stated that the owner had been marked as spam. **We never received a warning or a suspension notice**, and we explicitly asked what we were expected to fix.

![GitHub reinstatement request showing our message explaining the situation](/screenshots/github-reinstatement-request.png)

Some of the phrases from that request say it better than we could:

> *"I never received any warning, suspension notice, or explanation, so I am not sure what triggered this."*

> *"Without any information about the reason or status of the restriction, I cannot take any corrective action."*

![GitHub reinstatement request showing the date](/screenshots/github-reinstatement-request-date.png)

**As of today, more than ten days later, we still have no response.**

---

## Silence

Since then, silence.

No response. No clarification. No indication of whether this is under review, a mistake, an automated flag, or something else entirely. As of today, more than ten days later, **we still have no idea why this happened** or what we could do to resolve it.

This is frustrating not because a platform owes us special treatment, but because **without information, there is no way to correct behavior**, even if a mistake was made. We are more than willing to fix a problem if we know what the problem is. Right now, we simply do not.

---

## The Decision to Move

At some point, waiting became incompatible with continuing to ship.

So we made a pragmatic decision. Not a protest. Not a statement. **A continuity move.**

We moved Sciorex infrastructure away from GitHub and rebuilt our pipeline using **GitLab, Cloudflare Pages, and Cloudflare Workers**. This allowed us to regain control over releases, deployments, and visibility, without depending on a process we could not see or influence.

> **The transition was not free, and it was not trivial, but it allowed us to move forward.**

---

## Why We're Sharing This

We are sharing this experience for two reasons.

**First**, because it happened, and pretending it did not would be dishonest.

**Second**, because we suspect we are not the only small team or indie project to experience something like this, and we genuinely want to understand how and why these systems behave the way they do.

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Get the new released version!<br><br>Well... maybe you will have to wait until <a href="https://x.com/github">@github</a> fixes GHActions :(</p>&mdash; Sciorex (@sciorex) <a href="https://x.com/sciorex/status/2005701920242258352">December 29, 2025</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This post is not an attack on GitHub (right? ...), nor is it a call to abandon it. GitHub has enabled an enormous amount of collaboration over the years, and we are grateful for that. But it is also a reminder that **when critical infrastructure becomes opaque, even unintentionally, it can have very real consequences** for people trying to build.

---

## Moving Forward

Despite all of this, **Sciorex is moving forward.**

We are continuing development, releasing new versions, and opening the application to the public. The product you see today exists because we chose to keep building instead of waiting indefinitely for an answer.

If you have experienced something similar, or if you have insight into how these flags work and how to resolve them, we would genuinely appreciate hearing from you.

And if you are here because you are curious about what we are building, welcome.

> **This is Sciorex, and this is us shipping anyway.**

---

## Update 2026-01-12

Finally, after 15 days, GitHub got back to us and resolved the situation.

**That’s 15 days of having a public profile and project effectively erased, including our website hosted on GitHub Pages.** Just because of "an error" on their automated systems.

![GitHub reinstatement request update](/screenshots/github-reinstatement-request-update.png)