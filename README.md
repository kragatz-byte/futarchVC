# futarchVC

## Overview

FutarchyVC is an AI-native platform for startup evaluation that combines autonomous diligence agents with a forecasting layer inspired by futarchy.

The core idea behind FutarchyVC is that venture capital is fundamentally a forecasting problem. Investors must make decisions under extreme uncertainty, yet those decisions are often made by a relatively small group of individuals with limited information and bandwidth. FutarchyVC explores whether AI-generated diligence combined with collective forecasting can create a more scalable and transparent approach to startup evaluation.

## Problem

High-quality startup evaluation does not scale.

Traditional venture capital firms rely on analysts and associates to conduct extensive diligence on startups, including market research, competitor analysis, risk assessment, and investment memo generation. This process is time-intensive, expensive, and inherently limits the number of startups that can be evaluated in depth.

At the same time, prediction markets have demonstrated success in aggregating information and forecasting uncertain future events, but have rarely been applied directly to startup investing and capital allocation.

FutarchyVC seeks to bridge this gap by combining AI-powered venture diligence with crowd forecasting.

## How It Works

### Founder Submission Layer

Founders submit startup information including company descriptions, websites, fundraising details, traction metrics, and pitch materials.

### AI Diligence Layer

Submitted startups are analyzed through an AI-powered diligence pipeline that generates:

* Executive summaries
* Market analyses
* Competitor analyses
* Bull cases
* Bear cases
* Risk assessments
* Investment memos
* Suggested diligence questions

The goal of the AI system is not to make investment decisions, but to reduce the cost of generating high-quality investment research.

### Forecasting Layer

Users review AI-generated diligence and submit forecasts regarding startup outcomes, such as:

* Future fundraising success
* Revenue milestones
* Startup growth potential
* Overall investment attractiveness and, ultimately, their overall vote on the investment

### Decision Dashboard

Users browse startups through a scrolling feed and interact with:

* Startup profiles
* AI-generated diligence reports
* Investment decisions
* Forecasting tools
* Reputation systems
* Community leaderboards

The platform is designed to create an engaging environment where participants compete to identify promising startups before they become widely recognized.

## Technology Stack

### Frontend

* Expo React Native
* TypeScript

### Backend

* Supabase
* PostgreSQL
* Authentication
* Cloud Storage

### AI Layer

* OpenAI API
* Structured diligence generation workflows
* Prompt-engineered venture analyst roles

## AI Usage

Artificial intelligence is central to the functionality of FutarchyVC.

AI is used to:

* Analyze startup submissions
* Generate investment research
* Produce structured diligence reports
* Identify potential risks
* Evaluate market opportunities
* Generate investment memos

Importantly, AI does not make final investment decisions within the platform. Instead, AI serves as an analytical layer that augments human judgment and provides users with better information for decision-making.

## Development Process

This project was built using AI-assisted software development tools.

The majority of the codebase was generated and implemented using Cursor, which was used for feature development, debugging, application architecture, component generation, database integration, and frontend implementation.

ChatGPT was used throughout the development process to refine product specifications, generate detailed prompts for Cursor, refine the README file, and iterate on both the technical and conceptual aspects of the platform.

I determined all major product decisions, architecture choices, feature requirements, and project direction.

## Validation

To validate the concept, I spoke with founders and fellow students during a BASES (Business Association of Stanford Entrepreneurial Students) pitch event and gathered feedback on both the product concept and user experience.

Participants expressed interest in:

* A centralized startup discovery platform
* AI-generated diligence reports
* Reputation-based forecasting systems
* Competitive leaderboards

While this feedback was qualitative and limited in scale, it informed several design decisions and provided initial evidence of demand for the concept.

## Limitations

The project has several important limitations:

* The platform has not yet been deployed to a live user base.
* Long-term forecasting accuracy has not yet been measured.
* AI-generated diligence depends on the quality and completeness of founder-submitted information.
* Real capital deployment and venture fund operations are outside the scope of the current implementation.
* Economic incentive structures and legal fund formation remain future work.

## Future Work

Future development priorities include:

* Integration with external data sources
* Enhanced AI diligence workflows
* Campus-specific startup ecosystems
* Multi-university deployment
* Exploration of legal structures required for a fully functioning futarchy-governed venture fund

## Author

Kate Ragatz

Stanford University

CS 153: Frontier Systems
