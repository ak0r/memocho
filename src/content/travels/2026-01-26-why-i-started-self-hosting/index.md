---
title: Why I Started Self-Hosting (And You Might Want To)
slug: why-i-started-self-hosting
description: I got tired of being the product. This is why I started self-hosting my own infrastructure and whether it's worth the effort.
category: tech
published: 2026-01-26
tags:
  - self-hosting
  - privacy
cover: "[[homelab.png]]"
series: Why I Started Self-Hosting
order: 1
draft: true
---
I've been using Google Drive for years. Gmail since college. Google Photos has every picture from the last decade. It worked fine. Until I started paying attention to what "free" actually costs.

## The Real Cost of Free Services

Ads are everywhere now. YouTube, Instagram, every website. But ads are just the visible part. What you don't see: trackers recording every click, every page you visit, how long you stay, what you search for.

This data isn't just sitting there. It's analysed, packaged, sold. Your browsing habits become someone's targeting profile. That product you looked at once? Now it follows you across the internet for weeks.

Data is the new gold. Companies built billion-dollar businesses on it. And we handed it over because the services were "free."

> [!info] The Hidden Web
> Every time you visit a website, dozens of third-party domains load in the background. Google Analytics, Facebook Pixel, advertising networks, data brokers. A single news article might ping 40+ trackers. Most people never see this - it all happens in milliseconds.

## When I Realized Nothing Is Private

Google announced Gemini integration in Drive. AI that can read your documents, analyse your files, suggest edits. Sounds convenient, right?

That's when it hit me - my personal documents, photos, everything is training data now. There's no opt-out that matters. If it's on their servers, they can use it. The terms of service say so, buried in legal language nobody reads.

Big tech can't be trusted with private data anymore. Not because they're evil, but because their business model requires using that data.

## What Self-Hosting Actually Means

Self-hosting is running your own services instead of relying on Google, Meta, Microsoft. You use open source software on infrastructure you control.

It's not about being paranoid. It's about being realistic. If I don't want my data used to train AI models or sold to advertisers, I need to keep it off their servers.

The idea is simple: your photos on your server, your files on your storage, your network blocking trackers before they reach you.

## Why I Decided to Try

Two reasons drove me to experiment with self-hosting.

First, I wanted control. Not complete control - that's impossible unless you build your own internet - but enough to know where my data lives and who can access it.

Second, curiosity. I work with tech daily, but I'd never run my own infrastructure. What does it actually take to replace Google Photos? Can I really block thousands of trackers? There was only one way to find out.

## Being Honest About the Trade-offs

Self-hosting isn't a perfect solution. You still need internet. You still depend on some third-party services. Open source apps often have fewer features than their big tech counterparts.

And there's effort involved. You have to set things up, maintain them, fix things when they break.

But here's what I learned: it's the closest thing we have to real privacy. It's not all-or-nothing. You don't have to replace everything. Start with one service. See how it feels.

## What I Built

I set up a private mesh network that blocks ads and trackers across all my devices. The result? Over 25,000 trackers and ads blocked. Daily.

I replaced Google Photos with a self-hosted alternative. My photos live on my server now, not in Google's cloud.

I moved my important files from Google Drive to my own cloud storage.

The next two posts will cover these setups - what worked, what surprised me, and whether it's worth the effort.

> [!example] My Current Stack
> - **Tailscale** - Mesh VPN connecting all my devices
> - **AdGuard Home** - DNS-based ad/tracker blocking
> - **Immich** - Self-hosted Google Photos replacement
> - **Nextcloud** - Personal cloud storage
> - **Docker** - Everything runs in containers
> - **Oracle Cloud** - Free tier VPS for always-on services

## Should You Try Self-Hosting?

Maybe. If you're curious about how things work. If privacy matters to you. If you're tired of being tracked constantly.

> [!warning] The Reality Check
> Self-hosting won't give you perfect privacy. You still need internet providers, domain registrars, and some cloud services. But it's a significant step toward controlling your data.

You don't need to go all-in. Pick one thing that bothers you most. Maybe it's ads. Maybe it's photo privacy. Start there.

For me, it was worth it. Not because I've achieved perfect privacy - I haven't. But because I took back some control. And I learned that the trackers watching us are even more pervasive than I thought.