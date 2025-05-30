---
slug: archetype-driven-development
title: Archetype-Driven Development
authors: [jfulton]
tags: [archetypes, code-generation, rapid-prototyping, agentic-coding, architecture]
---

Throughout my career as a software engineer and architect, I've watched countless teams struggle with the same problem over and over again. We'd spend weeks on project setup, configuration, and boilerplate instead of solving actual business problems. I tried every code generator out there, but none checked all the boxes. They were either too rigid, too complex, or just didn't fit how real teams work.

A few years back, I built Archetect to solve this for myself and the teams I was working with. We've been using it internally at companies as a competitive advantage, shipping projects faster while maintaining consistency and quality. It's always been open source, but I've never really promoted it. I think it's time to share it with a broader audience.

<!--truncate-->

## The Problem

Starting a new project sucks. You either spend days manually setting up build systems, configuring linters, writing boilerplate, and making a thousand tiny decisions, or you're explaining the same preferences to an AI over and over again. Either way, you're burning time on solved problems instead of building the thing you actually care about.

## The Solution

Archetype-driven development flips this around. Instead of starting from scratch every time, you begin with a template that already knows your team's standards and preferences. Think of it like having the perfect starter kit that adapts to what you're building.

Want a microservice? You get one with logging, error handling, database setup, and testing already configured. Building a React app? Here's your complete setup with routing, state management, and all the tooling you need. The archetype handles the foundation so you can focus on what makes your project unique.

The beauty is in the consistency. Every project follows the same patterns. New developers don't waste time decoding different architectural choices across codebases. Code reviews focus on logic instead of style debates. Security and performance best practices are baked in from day one.

Archetypes aren't static either. With Archetect, every file is a template that adapts based on your inputs. TypeScript or JavaScript? GraphQL or REST? The archetype adjusts accordingly while keeping everything consistent.

## Works with Everything

This works whether you're coding manually or using AI tools. When you're hand-crafting code, you skip all the tedious setup and jump straight to the interesting problems. When you're working with an LLM, you start from a position of strength. The AI immediately understands your project structure and doesn't need you to explain your preferred patterns. Instead of burning tokens on boilerplate, you can focus on the business logic and features that actually matter.

I've seen teams generate complete microservices in seconds, then hop into their AI tool with "now add user authentication with these requirements." The AI gets it immediately because the foundation follows familiar patterns.

The real win isn't just speed, it's focus. When you stop reinventing project setup every time, you finally get to concentrate on building something that matters.