---
title: Replacing Google Photos and Drive
description: Moving away from Google's cloud to self-hosted alternatives. Immich for photos, Nextcloud for files - fewer features, but my data stays mine.
category: tech
published: 2026-02-11
tags:
  - self-hosting
  - privacy
cover: "[[immich.png]]"
draft: true
series: Why I Started Self-Hosting
order: 3
---
## The Trigger

Google announced Gemini integration in Drive. AI that can read your documents, summarize them, answer questions about your files.

Sounds convenient. But here's what that actually means: an AI model accessing your private documents. Reading your personal notes. Analyzing your photos. All to provide "helpful" features.

I knew then that nothing stored on Google's servers was truly private anymore. If their AI can read it, so can their systems, their employees with access, their data analysis pipelines.

That was the moment I decided to move my photos and files off Google.

## What I Actually Wanted

Before jumping into self-hosting, I thought about what I actually needed:

**For photos:**

- Automatic backup from my phone
- Ability to browse and search
- Face recognition would be nice, but not essential
- Most importantly: my photos, on my storage, not training someone's AI

**For files:**

- Sync across devices (laptop, phone, tablet)
- Share links when needed
- Collaborative editing would be nice but not critical
- Again: my data, my control

I wasn't trying to replicate every Google feature. Just the core functionality, with privacy.

## The Alternatives: Immich and Nextcloud

After researching options, I went with:

**Immich** for photos - open source, actively developed, looks and feels similar to Google Photos. It has mobile apps, automatic upload, and even machine learning features that run locally on your server.

**Nextcloud** for files - the obvious choice for self-hosted cloud storage. It's mature, well-maintained, and has clients for every platform.

Both run in Docker containers on my home server. Both are free and open source.

## Setting Up Immich

Immich was surprisingly straightforward. The Docker Compose setup from their documentation just works. Point it at a folder for photos, configure a few environment variables, and it's running.

The mobile app connects to your server (through Tailscale, in my case), and photos upload automatically in the background. Just like Google Photos did.

The interface is clean. Albums, search, timeline view - all the basics are there. The machine learning features (object recognition, face detection) happen on your server, not in someone else's cloud.

**The migration:** I downloaded my Google Photos archive (all 50+ GB of it), and uploaded it to Immich. It took a day, but now those photos are mine again.

## Setting Up Nextcloud

Nextcloud is more involved than Immich. Not complicated, just more configuration options.

Docker Compose setup, point it at storage, configure database (I used PostgreSQL), set up reverse proxy for HTTPS. The Nextcloud documentation walks through it all.

Desktop clients sync folders automatically. Mobile apps work fine for viewing and uploading files. Sharing works - you can generate public links or share with specific users.

**The migration:** I didn't move everything from Google Drive at once. Started with important documents, personal files, things I actually care about. The random old files? Still on Drive. I'll move them eventually, or maybe I won't. No rush.

## What I Gained

**Privacy that's actually real.** My photos live on a drive I can physically touch. Google's AI isn't analyzing them. No one's using them as training data.

**Control over my data.** If I want to back it up, I copy the folder. If I want to move it somewhere else, I move it. No export tools, no waiting for archives, no format conversions.

**Learning how things work.** Running these services taught me more about storage, databases, networking, and backups than any tutorial could.

## What I Lost

Let's be honest about the tradeoffs.

**Google Photos search is incredible.** Search for "beach" and it finds every beach photo. Search for "dog" and it finds dogs, even without tags. Immich has search, but it's not as good. The machine learning models Google uses are trained on billions of images. Mine isn't.

**Collaboration in Nextcloud is basic.** Multiple people can edit files, but it's not real-time like Google Docs. You see changes when you refresh. For serious collaboration, I still use Google Docs when needed.

**Maintenance is on me.** When Docker updates, I update. When something breaks, I fix it. Google just works - until they decide to change the product or shut it down.

**Mobile uploads sometimes fail.** Usually network issues when switching between WiFi and cell data. Google's app handles this seamlessly. Immich's app is improving, but not perfect yet.

## Is It Worth It?

For me, yes.

I'm not claiming Google Photos and Drive are bad products. They're excellent products. That's the problem - they're so good that we accept giving up privacy in exchange.

Immich and Nextcloud give me less features but more control. That trade makes sense to me.

Would I recommend this to everyone? No. If you're not comfortable with Docker, Linux, and troubleshooting, it's probably too much work. And that's fine - privacy through self-hosting isn't for everyone.

But if you care about data privacy and you're willing to learn, it's absolutely doable.

> [!example] What I'm Running
> 
> - **Immich**: Self-hosted photo management with ML features
> - **Nextcloud**: Personal cloud storage and file sync
> - **PostgreSQL**: Database for both services
> - **Docker**: Everything containerized for easy management
> - **Storage**: Local drives + encrypted backups to cloud

> [!warning] The Reality Open source alternatives have fewer features than big tech products. That's just true. The question is whether privacy and control matter enough to accept those limitations.

## Final Thoughts

Moving off Google Photos and Drive wasn't about perfection. It was about deciding where my privacy line is.

Some people are fine with big tech having their data. Some people want zero cloud services at all. I'm somewhere in between - self-hosting what matters, using cloud services where the tradeoff makes sense.

Three months in, I haven't looked back. My photos are backed up, my files are synced, and I know exactly where my data lives.

That peace of mind is worth the effort.