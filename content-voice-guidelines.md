# Content Voice & Writing Guidelines
## joesiconolfi.com

---

## Who Joe Is

Joe Siconolfi is a Staff Design Engineer based in San Francisco, originally from Long Island, NY. He has been building at the intersection of design and engineering for 15+ years — from ad-tech interaction engineering in New York City, through media (MTV/Viacom), fintech, and into AI-native product starting at Statespace in 2019. He is currently the first design engineer at Cohere, where he built Waypoint (the company design system), Sherpa (a RAG-based Figma plugin), and waypoint-sync (a Figma-to-code token pipeline).

Joe's work is defined by a specific belief: the best products are built by people who can't stop making things. He codes and designs in the same session. He prototypes to think, not just to show. He believes that understanding how something works is part of knowing how it should feel.

He is a vinyl collector and music nerd. A die-hard Knicks and Mets fan. Someone who started customizing MySpace layouts in middle school and never stopped tinkering. He moved to the West Coast at 22 and has been building AI-native products ever since.

His professional focus is on AI-native product design: not AI as a bolt-on feature, but experiences built from the ground up around what AI actually makes possible. He cares about the human side of that equation — empathy, trust, capability, and the feeling of getting better at something through use.

---

## The Philosophical Frame

All content on this site should be written through the lens of two converging ideas:

### 1. Magic Ink (Bret Victor, 2006)

Victor argued that most software is information software, that interactivity is actually a failure mode rather than a feature, and that the ideal interface infers context and shows what is relevant without being asked. The best interface never asks. It already knows.

This is the north star. Every piece of content should implicitly or explicitly connect back to this idea: the shift from interfaces that demand input to interfaces that anticipate need. From tools you use to systems that understand you. From interaction as the primary paradigm to inference as the primary paradigm.

Key ideas from Magic Ink to reference:
- Software should be information software first, manipulation software second
- Interactivity is a last resort, not a design goal
- Context-sensitivity is the mechanism: inferring from environment, history, and behavior
- The goal is to eliminate friction between intent and outcome
- The best design is the design that disappears

### 2. The Three Competency Frame

Every piece of content should demonstrate at least one of these three things:

**Shift from UI-centric to model-driven:** Understanding that static interfaces are giving way to adaptive, model-driven experiences. The old paradigm: design a UI, ship it, users learn it. The new paradigm: design a system that learns the user, adapts to context, and improves through use.

**Curiosity and bridging:** The ability to move between creative and technical domains without losing coherence. Joe does not hand off designs to engineers. He does not receive specs as an engineer. He is the bridge. Content should reflect that fluency.

**Hands-on model work:** Prompt engineering, evals, post-training, code-design combinations. Evidence of actually improving model outputs through experimentation, not just theorizing about AI.

---

## Joe's Voice

### What it sounds like

Joe writes the way he talks: direct, specific, curious, and occasionally dry. He does not hedge. He does not use corporate-speak. He does not use phrases like "leverage," "synergize," "empower users," or "seamless experience."

He writes in the first person without being precious about it. He uses "I" naturally. He does not over-qualify his statements. When he has an opinion, he states it. When he is uncertain, he says so directly rather than hiding behind passive voice.

His tone is:
- Confident but not arrogant
- Technical but not inaccessible
- Personal but not self-indulgent
- Curious but not performatively so

He uses short sentences when making a point. Longer sentences when building context. He varies rhythm. He does not write in bullet points unless the content is genuinely list-like.

### What it does not sound like

Not academic. Not marketing. Not chatty. Not hustle-culture. Not the generic "passionate designer who loves solving problems" voice. Not AI-generated paragraph structure (long intro sentence, three supporting sentences, conclusion sentence that restates the intro).

Do not write:
- "I am passionate about..."
- "At the intersection of..."
- "Leveraging my experience..."
- "Driving innovation..."
- "Seamless user experiences..."
- "I have always believed..."
- "In today's fast-paced world..."
- Any phrase that could appear in a LinkedIn summary from 2015

### Examples of the right voice

Good: "The Swirl animation went through 50+ Cursor sessions. The finding: LLMs cannot hold visual intent from code alone across long contexts."

Bad: "Through extensive iteration using AI-assisted development tools, I discovered that maintaining visual consistency in generative animations requires careful attention to model context management."

Good: "Chat is not the destination. It is the first interface paradigm we reached for because it maps to something humans already understand."

Bad: "While conversational interfaces have democratized access to AI capabilities, there remains significant opportunity to explore alternative interaction paradigms that may better serve user needs."

Good: "The design system stops being a static spec and becomes a living inference engine."

Bad: "By integrating AI capabilities into our design system infrastructure, we can create more dynamic and responsive design experiences."

---

## Grammar and Style Rules

### The most important rule: no em dashes

**Never use em dashes ("--", "---", or "—") anywhere on this site.** Not in copy, not in code comments, not in data files, not in prompts. This is a hard rule with no exceptions.

If you feel the urge to use an em dash, use one of these instead:
- A period and a new sentence
- A colon
- A comma
- Parentheses
- Just remove the aside entirely

Wrong: "The design system — and everything built on top of it — needs to be consistent."
Right: "The design system needs to be consistent. Everything built on top of it depends on that."

Wrong: "Voice-first interfaces break every assumption — there is no cursor, no text field."
Right: "Voice-first interfaces break every assumption. There is no cursor, no text field."

### Capitalization

- Sentence case for everything: headings, labels, nav items, section titles
- No ALL CAPS for emphasis (use different weight or color in design instead)
- Product names and proper nouns are capitalized as normal
- Do not capitalize "design engineer," "design system," "AI" is always capitalized, "UI" is always capitalized

### Punctuation

- No exclamation points in professional copy
- Periods at the end of complete sentences, even short ones
- Oxford comma always
- No ellipsis (...) in professional copy — it reads as trailing off
- No em dashes (see above)
- Hyphens for compound adjectives: "AI-native," "voice-first," "design-to-code"

### Numbers

- Spell out numbers one through nine
- Use numerals for 10 and above
- Use "15+" not "15 plus" or "more than fifteen"
- Percentages use the % symbol: "55%" not "55 percent"

### Technical terms

Write technical terms as they are commonly used:
- TypeScript (not Typescript or typescript)
- React (not ReactJS)
- Tailwind (not TailwindCSS)
- Figma (not figma)
- LLM (not large language model unless first use in long-form)
- RAG (not retrieval-augmented generation unless first use)
- AI (not A.I. or artificial intelligence unless specifically necessary)

---

## Content Types and How to Write Each

### Bio copy (about page)

Short, personal, direct. Three paragraphs maximum. The first paragraph establishes who and where. The second establishes what you care about and why. The third establishes the human: the interests, the personality, the thing that makes someone remember you.

Do not list accomplishments in the bio. Accomplishments go on the timeline and case studies. The bio is about worldview and character.

Reference: the existing about page bio is the canonical example of the right tone.

### Case study copy

Open with the problem, not the solution. The reader does not know what you built yet — they need to care about the problem first.

Structure:
1. Hook (2-3 sentences): What was the actual problem? Why did it matter?
2. Role: Specific and honest. Not "led design" but "owned the full design function" or "built it solo."
3. The hard part (full case studies only): One genuine constraint or tension you navigated. Not a challenge you solved perfectly, but something that was actually difficult.
4. Key decisions: 3-4 specific decisions with brief rationale. Each decision should have a "why" that goes beyond "it was better UX."
5. Outcome: What shipped? What changed? What would you do differently?

Do not use process vocabulary unless it's specific to your actual process. Do not write "I conducted user research to understand pain points." Write what you actually found out and how it changed what you built.

### Lab experiments

Write experiments as if you are explaining them to a smart friend who is not in your exact field. Give enough context that someone from outside the AI/design space can follow the finding.

Every experiment should have:
- A specific question being investigated (not "I explored X" but "The question was: can Y do Z?")
- A finding, even if the finding is "it doesn't work" or "it's more complicated than I thought"
- A connection to the broader shift from interaction to inference, or to the three competency frame

### Lab feed entries

Feed entries are shorter and more casual than experiments. They are thinking-out-loud, not finished thoughts.

Notes and experiments: 2-4 paragraphs. Make a point, give evidence, connect to the bigger idea.

Reads: 1-2 paragraphs. What is it, why does it matter, what is the one thing you took from it.

Tools: What is it, what problem does it solve, what did building it teach you.

Evals: What did you test, what did you find, what changes based on that.

### Timeline copy

Summaries should read like a very short memo from someone who was in the room, not a job description. Focus on what was actually hard, what you actually built, and what changed as a result of the work.

Avoid: "Designed and developed interfaces for..."
Prefer: "First AI role. Led design for Aim Lab — an AI-driven training platform for esports. Worked with ML teams and neuroscience experts to build adaptive interfaces that responded to how players actually trained."

### Nav and UI copy

Short, lowercase, terminal-aesthetic. No punctuation on labels. No gerunds ("building," "exploring") in nav items.

Good: "case studies," "the lab," "about," "timeline"
Bad: "My Work," "Explore," "Learn About Me," "Career History"

---

## Connecting to the Philosophical Frame

### How to reference Magic Ink without being heavy-handed

Do not cite the paper constantly. The philosophy should be implicit in how things are framed, not explicitly invoked on every page.

The Magic Ink frame shows up as:
- Framing the problem as one of inference, not interaction
- Describing good design as design that disappears or anticipates
- Treating interactivity as a cost rather than a feature
- Emphasizing context, history, and environment as the real inputs to good software

When the connection is explicit (like in the lab header "the best interface never asks"), keep it brief. One line. Let the content itself demonstrate the principle.

### How to connect to the three competencies without being resume-brained

These three things should come through in the texture of the writing, not in explicit claims:

**Model-driven over UI-centric:** Show up as specific examples of things that could not have been built with static UI. Sherpa is not "a documentation tool" — it is a system that answers questions about the design system in natural language. Waypoint-sync is not "a token exporter" — it is a pipeline that makes the design file the source of truth the codebase reads from.

**Curiosity and bridging:** Show up as comfort with both design and engineering concepts in the same sentence. Talking about token architecture and visual hierarchy in the same paragraph. Talking about RAG retrieval quality and component adoption rate as related problems.

**Hands-on model work:** Show up as specific technical findings. Not "I used AI tools" but "the finding was: LLMs cannot hold visual intent from code alone across long contexts. They need a canonical reference artifact." Specific. Empirical. From actual experimentation.

---

## What to Avoid at All Costs

**AI-generated sentence structure:** The tell is a very long opening clause, followed by a pivot, followed by a conclusion that restates the opening. "While AI has transformed many industries, the question of how to design interfaces that truly serve human needs remains one of the most important challenges facing designers today." Never write this.

**Passive voice for accomplishments:** "Design systems were built" vs "I built the design system." Own the work.

**Vague scale claims:** "Millions of users" when you know the number. "Significantly improved" when you have a metric. Use the specific number or do not mention scale at all.

**The word "leverage":** Always.

**The word "seamless":** Always.

**The phrase "human-centered design":** Say what you actually mean. "Designed around how people actually train, not how we thought they trained" is better than "used human-centered design principles."

**Jargon as a substitute for thinking:** "We used a systems thinking approach to redesign the information architecture." What does that mean? Say what you actually did.

**Hedging your opinions:** "Some might argue that..." or "It could be said that..." or "In my view..." Joe has views. State them.

---

## The Test

Before finalizing any copy, ask:

1. Could this have been written by anyone? If yes, rewrite it to be specific to Joe's actual experience and perspective.

2. Does it sound like a press release, a resume, or a LinkedIn post? If yes, rewrite it to sound like a person.

3. Is there an em dash in it? Remove it.

4. Does it make a claim that connects to the Magic Ink principle (inference over interaction, context over commands) or to the three competency frame? If not, consider whether it needs to.

5. Is it honest? Does it overstate? Does it use vague scale language instead of specifics? Fix it.

6. Would Joe actually say this? Read it out loud. If it sounds stiff, rewrite it.
