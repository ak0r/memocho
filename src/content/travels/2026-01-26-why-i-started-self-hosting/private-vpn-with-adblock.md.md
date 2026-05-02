---
title: Setting Up a Private Network That Blocks Ads
description: How I built a mesh VPN with DNS-level ad blocking that stops 25,000+ trackers daily. Tailscale + AdGuard Home on a free Oracle VPS.
category: tech
published: 2026-02-02
tags:
  - self-hosting
  - privacy
cover: "[[notes/2026-01-26-why-i-started-self-hosting/adguard.png]]"
draft: true
series: Why I Started Self-Hosting
order: 2
---
## The Problem I Wanted to Solve

After deciding to self-host, the first thing I wanted to tackle was tracking. Not just ads - the invisible trackers that follow you across every website, every app, every device.

Browser extensions like uBlock Origin work great, but only on that browser. What about my phone? Smart TV? Other devices? I needed something that protected everything on my network, automatically.

## Why DNS-Level Blocking

Most ad blockers work by hiding ads after they load. DNS-level blocking stops them from loading at all.

Here's how it works: when your device wants to connect to a website, it asks a DNS server "what's the IP address for example.com?" DNS blocking maintains a list of known tracker and ad domains. When your device asks for "tracker.com", the DNS server just says "nope, doesn't exist."

No ads downloaded. No tracking scripts executed. No bandwidth wasted.

And because DNS happens before anything else loads, it protects every device using that DNS server.

## The Setup: Tailscale + AdGuard Home

I went with two tools:

**Tailscale** creates a private mesh network between all my devices. My laptop, phone, home server - they all connect securely, even when I'm not home. It's like a VPN, but simpler and faster.

**AdGuard Home** is the DNS server that blocks ads and trackers. It runs on a small VPS and handles DNS queries for any device connected to my Tailscale network.

## Why Oracle Cloud Free Tier

I needed something running 24/7 to handle DNS queries. Oracle Cloud's free tier gives you a small VM that's always on, costs nothing, and has enough resources for AdGuard Home.

The setup is simple: spin up a VM, install AdGuard Home, configure it to only accept queries from your Tailscale network. That's it.

I specifically didn't run a full DNS server - just ad blocking. My AdGuard forwards legitimate queries to Cloudflare's 1.1.1.1. I'm not trying to run internet infrastructure, just filter out the garbage.

## The Results

Once everything was running, I checked the AdGuard dashboard.

**25,000+ queries blocked. Per day.**

Not total queries - blocked queries. Trackers and ads that tried to load but got stopped. Across all my devices combined.

Some days it's higher. Weekends when I'm browsing more, it can hit 30,000. That's how much tracking happens in the background that you never see.

## What Actually Gets Blocked

Looking at the logs, here's what shows up constantly:

- Google Analytics on almost every site
- Facebook tracking pixels
- Advertising networks: DoubleClick, AdSense, dozens of others
- Data brokers you've never heard of
- App telemetry sending usage data back to servers
- Smart TV trying to phone home with viewing habits

A single news article might trigger 20+ blocked requests. A YouTube video? 30+.

It's not paranoia when you can see the actual numbers.

## Trade-offs and Issues

**Some sites break.** Rarely, but it happens. A site might use the same domain for ads and actual content. When that's blocked, parts of the page don't work. Solution: temporarily disable blocking or whitelist that domain.

**Mobile apps can be tricky.** Some apps detect ad blocking and refuse to work. Most don't care, but a few do.

**It's not perfect.** Some trackers use the same domains as content (YouTube ads, for example). DNS blocking can't distinguish between "youtube.com/video" and "youtube.com/ad" - they're the same domain.

But even with limitations, blocking 25,000 trackers daily makes a huge difference.

## Is It Worth the Effort?

Setup took me a few hours. Mostly reading documentation and figuring out Tailscale's configuration.

Maintenance? Almost zero. AdGuard updates itself. Tailscale just works. I check the dashboard occasionally out of curiosity, but it runs itself.

The privacy gain is real and measurable. Every blocked tracker is one less data point collected about my browsing.

Would I recommend it? If you're comfortable with basic Linux and VPS setup, absolutely. The Oracle free tier means it costs nothing. The privacy benefit is immediate and ongoing.

> [!example] What I'm Running
> 
> - **Tailscale**: Mesh VPN connecting all devices (free tier)
> - **AdGuard Home**: DNS-level blocking (open source)
> - **Oracle Cloud**: ARM-based VM, always free tier
> - **Blocklists**: Standard AdGuard lists + some custom additions

> [!success] Daily Impact 25,000+ trackers and ads blocked across all my devices. Every single day. That's the baseline now - some days it's significantly higher.

## What's Next

DNS blocking handles a lot, but it's just one piece. The next step was replacing Google's services themselves - starting with photos and file storage.

That's where things got more interesting.