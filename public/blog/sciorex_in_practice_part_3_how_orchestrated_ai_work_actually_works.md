*This is a 3-part blog series:*
1. [**Part 1: Why AI Workflows Break**](../sciorex-beta-launch-part-1-why-ai-workflows-break)
2. [**Part 2: The Future of AI Work**](../sciorex-vision-part-2-the-future-of-ai-work)
3. **Part 3: Feature Showcase** (You are here)

---

## Sciorex in practice: how orchestrated AI work actually works

The first two posts explained why AI workflows break and where we believe AI work is heading.

This post focuses on how Sciorex works in practice.

Not at the level of prompts or demos, but at the level where real work happens: files, decisions, context, and coordination.

### Quick preview: the agentic chat in action

Before diving into the details, here is a 1-minute preview of Sciorex's chat interface. In this example, we implement multi-language support for the Sciorex landing page, entirely through conversation.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/lADSuVehHfg" title="Sciorex Agentic Chat Preview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

---

## A core principle: tasks carry context, epics carry intent

In Sciorex, conversations, agent runs, flow executions, and generated artifacts are attached to tickets.

**Tickets are the unit of execution.**

Epics, on the other hand, carry intent. They represent the long-lived context of a feature, a research direction, or a system. Architectural decisions, standards, constraints, and goals live at the epic level.

This context is stored as files inside the workspace, typically as structured documentation. Think of it less like a traditional IDE project and more like an Obsidian-style knowledge space. Markdown documents, diagrams, PDFs, notes, hypotheses, summaries, and design decisions all live alongside the work.

Tickets reference this material instead of duplicating it.

> This separation matters. Tickets change quickly. Intent should not.

---

## The orchestrator: making sure work stays coherent

At the center of Sciorex workflows is the concept of an orchestrator.

The orchestrator is responsible for the overall state of an epic. Its job is not to write code, but to ensure that work is properly framed.

Every ticket creation decision can go through the orchestrator, either as an agent or as a human acting in that role.

The orchestrator:
- asks clarifying questions until the goal is crystal clear
- creates epics and initial tickets
- decides what context is required for each task
- attaches relevant files, standards, and acceptance criteria
- ensures that downstream agents have everything they need to succeed

Some teams will automate this role. Others will keep it human-driven. Sciorex supports both.

---

## A typical orchestrated flow

A common flow might look like this:

1. A user asks for a new feature or research goal
2. The orchestrator asks clarifying questions
3. An epic is created
4. Initial tickets focus on documentation and intent
   - project goals
   - acceptance criteria
   - constraints and assumptions
5. Architectural decisions are explored and written down
6. The orchestrator reads the new files and decomposes the work into concrete tickets
7. Each ticket includes explicit context and references

Only after this does implementation begin.

For each ticket, a flow is triggered:
- an agent reads and validates the ticket context
- if context is insufficient, it escalates back to the orchestrator or a specialist agent
- implementation happens in isolation
- a review agent evaluates changes using the full diff or worktree
- testing and documentation agents run
- new tickets can be created automatically if issues or edge cases are discovered

> The goal is not speed at any cost. **The goal is coherence.**

---

## Not another IDE

Sciorex is not trying to replace your IDE.

An IDE, for non-technical readers, is a tool focused on writing and editing code. It optimizes for typing, navigation, and refactoring.

Sciorex optimizes for understanding, coordination, and review.

That said, real work involves files. So Sciorex supports multiple ways of interacting with them.

### Three ways to work with files

#### 1. Built-in review editor

Sciorex includes a minimal editor powered by Monaco and a file tree.

This editor is intentionally not optimized for heavy coding. It is optimized for reviewing and understanding material:
- rich Markdown previews
- PDF reading
- diagrams and images
- plots and research artifacts
- documentation-focused workflows

This is especially important for research, design, and long-lived documentation.

#### 2. VS Code Web integration

For users who want a full editor experience inside the App, Sciorex can embed VS Code Web.

#### 3. External IDE integration

Sciorex is not trying to compete with modern IDEs.

Quite the opposite.

The industry has already done an impressive job building agentic IDEs. Tools like VS Code and its ecosystem, Cursor, and others are pushing fast on inline agents, diff views, refactoring assistance, and contextual code understanding. In many cases, you can already review changes, inspect diffs, and navigate large codebases with a single click.

We do not want to replace that.

What we want is to work with it.

Sciorex focuses on orchestration, context, and coordination. IDEs focus on editing, navigation, and local productivity. Those responsibilities fit together naturally.

For users who want to keep coding in their editor of choice, Sciorex integrates with any VS Code–compatible IDE, whether that is VS Code desktop, Cursor, or others.

We provide a lightweight bridge extension (https://github.com/sciorex/bridge) that allows Sciorex to:

- open files directly in the external editor
- open diff views for specific tickets or agent runs
- ...

Our long-term goal is deeper collaboration.

As IDEs continue to evolve their own agentic experiences, we want to explore how Sciorex can surface the same context and state inside those environments. That includes opening an external IDE already positioned in the relevant ticket context, or even reflecting the same agentic view that exists inside Sciorex.

At the same time, Sciorex maintains its own agentic view of the repository.

This view is designed to answer a different question: what changed overall, and why?

You can always see which agents touched which files, how changes relate to tickets and epics, and how the system evolved over time. This prevents losing track of global changes, even when work is distributed across multiple agents and tools.

When deeper inspection or manual intervention is needed, a single click is enough to jump into the external editor and continue working there.

Sciorex orchestrates. But IDEs still have a place.

**That separation is intentional.**

---

## Chat as an interface, not a product

**Sciorex is not a chat app.**

But chat is still a powerful interface.

We support deep chat integration with:
- Claude Code
- Gemini CLI
- OpenAI Codex

We also support LM Studio and Ollama through Codex OSS compatibility.

Everything runs locally. Sciorex directly calls provider CLIs in headless mode. We are not an API proxy. No chat data is sent to us.

> For beginners, we recommend Gemini CLI, as it currently offers a free tier. Users with capable GPUs can run local models through Codex and still benefit from the same workflows. For the best experience, we recommend Claude Code; it is the most mature and feature-rich integration.

Flows and agents use the same underlying mechanism as chat. At any point, a flow can be paused and a human can interact directly with a specific agent.

---

## MCPs: teaching agents how Sciorex works

To make all of this possible, Sciorex includes three internal MCP servers.

### Interaction MCP

This allows agents to:
- ask questions
- request approvals
- send notifications

### Resources MCP

This server teaches language models how to create agents and flows for Sciorex.

Instead of manually configuring everything, users can describe what they want in natural language. The system can then generate and configure agents and flows automatically.

This enables discussion and iteration on workflows themselves, not just execution.

### Ticketing MCP

This server exposes the kanban system to agents.

Agents can create, read, and update epics and tickets, and fetch all relevant context required to complete a task.

---

## See it in action

The concepts above might sound abstract. Here are two short videos that show how Sciorex works in practice.

### Creating agents and flows through conversation

In this video, we create a series of agents and flows just by chatting with the LLM. The model already has access to all the tools (via the Resources MCP) and context it needs to create fully functional flows and agents.

No manual configuration. No YAML files. Just describe what you want.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/CnIs7eQFzKM" title="Sciorex Agent Flow Showcase" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Running a flow: context passing in action

This video shows a specific flow being executed. Watch how context from one agent is passed to the next agent in the chain, based on the flow's defined inputs and outputs.

This is what orchestrated AI work looks like: agents that know what came before and what comes next.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/2JeCqZmJw_w" title="Sciorex Flow Run" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

---

## Community agents and flows

Sciorex is designed so that agents and flows are not hardcoded into the product.

They are first-class artifacts.

That means they can be shared.

Instead of a traditional marketplace, Sciorex uses a community-driven library of agent and flow templates. Anyone can publish them. Anyone can reuse them. From simple task flows to complex multi-agent pipelines.

The app integrates directly with this library, allowing users to browse and install community extensions with a single click.

This matters for two reasons.

First, no single team can anticipate every workflow. Security analysis, research pipelines, DevOps automation, code review strategies, incident response. Different teams work differently, and Sciorex is built to adapt to that reality.

Second, workflows themselves become a form of knowledge. A well-designed flow encodes best practices, trade-offs, and experience. *Sharing them accelerates learning far more than sharing prompts ever could.*

The community library is public and evolving:

👉 https://github.com/sciorex/community-extensions

Over time, we expect this to become one of the most important parts of the ecosystem.

---

## What this enables

By combining orchestration, persistent context, agent specialization, and event-driven flows, Sciorex enables workflows that are difficult or impossible with chat-based tools.

Security analysis. Research pipelines. Complex feature development. Long-running investigations.

The possibilities are not infinite, but they are wide.

---

## Closing

Sciorex is not polished.

It is closer to an MVP than a traditional Beta. There will be bugs. Things will break. Some workflows will feel awkward or incomplete.

You may get frustrated. You may have to wrestle the system a bit before it starts working with you instead of against you.

We know.

But we also felt it was the right time to ship, show our direction, and build this together with people who actually push AI systems hard.

We will iterate fast. We will break things. We will fix them.

If you have ideas, complaints, or features you want to see, open an issue and tell us.

👉 https://github.com/sciorex/sciorex/issues

Let us cook 😄