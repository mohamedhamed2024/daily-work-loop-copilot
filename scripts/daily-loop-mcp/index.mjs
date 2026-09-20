#!/usr/bin/env node
/**
 * Daily Work Loop Copilot — read-only MCP tools (commands, subagent prompts, status report plan).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT =
  process.env.DAILY_LOOP_PLUGIN_ROOT ||
  process.env.CURSOR_PLUGIN_ROOT ||
  path.resolve(__dirname, "../..");

function read(rel) {
  const p = path.join(PLUGIN_ROOT, rel);
  return fs.readFileSync(p, "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(PLUGIN_ROOT, rel));
}

const COMMANDS = [
  { name: "start-day", file: "commands/start-day.md" },
  { name: "my-queue", file: "commands/my-queue.md" },
  { name: "next-task", file: "commands/next-task.md" },
  { name: "eod-wrap", file: "commands/eod-wrap.md" },
  { name: "handoff", file: "commands/handoff.md" },
  { name: "daily-status-report", file: "commands/daily-status-report.md" },
];

const SKILLS = [
  { name: "daily-work-loop", file: "skills/daily-work-loop/SKILL.md" },
  { name: "work-queue-ranking", file: "skills/work-queue-ranking/SKILL.md" },
  { name: "jira-bitbucket-daily-data", file: "skills/jira-bitbucket-daily-data/SKILL.md" },
  { name: "github-daily-data", file: "skills/github-daily-data/SKILL.md" },
  { name: "daily-eod-wrap", file: "skills/daily-eod-wrap/SKILL.md" },
  { name: "daily-handoff", file: "skills/daily-handoff/SKILL.md" },
  { name: "daily-status-report", file: "skills/daily-status-report/SKILL.md" },
];

const SUBAGENTS = {
  exploration: "agents/exploration.md",
  execution: "agents/execution.md",
  verification: "agents/verification.md",
  orchestration: "agents/subagent-orchestration.md",
};

const server = new Server(
  { name: "daily-loop-tools", version: "0.3.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_daily_loop_commands",
      description: "List Daily Work Loop slash commands and short descriptions.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_daily_loop_command",
      description: "Get full command procedure markdown for one command.",
      inputSchema: {
        type: "object",
        properties: {
          command: {
            type: "string",
            enum: COMMANDS.map((c) => c.name),
          },
        },
        required: ["command"],
      },
    },
    {
      name: "get_subagent_prompt",
      description:
        "Build a Task subagent prompt for exploration, execution, or verification.",
      inputSchema: {
        type: "object",
        properties: {
          phase: {
            type: "string",
            enum: ["exploration", "execution", "verification"],
          },
          workspace_path: { type: "string", description: "Absolute pilot repo path" },
          command: { type: "string", description: "e.g. start-day, eod-wrap" },
          integration_stack: {
            type: "string",
            enum: ["atlassian", "github"],
          },
          args: { type: "string", description: "User flags" },
          exploration_output: {
            type: "string",
            description: "Required for execution/verification phases",
          },
        },
        required: ["phase", "workspace_path", "command"],
      },
    },
    {
      name: "list_daily_loop_skills",
      description: "List skill names and relative paths in the plugin.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "plan_daily_status_report",
      description:
        "Return workflow steps, command/skill paths, and subagent sequence for a status report.",
      inputSchema: {
        type: "object",
        properties: {
          days: { type: "number", default: 1 },
          audience: {
            type: "string",
            enum: ["team", "lead", "executive"],
          },
          integration_stack: {
            type: "string",
            enum: ["atlassian", "github"],
          },
          confluence: { type: "boolean", default: false },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_daily_loop_commands") {
      const list = COMMANDS.map((c) => {
        let desc = c.name;
        if (exists(c.file)) {
          const m = read(c.file).match(/^description:\s*(.+)$/m);
          if (m) desc = m[1].trim();
        }
        return { command: c.name, slash: `/${c.name}`, description: desc };
      });
      return {
        content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
      };
    }

    if (name === "get_daily_loop_command") {
      const cmd = args?.command;
      const entry = COMMANDS.find((c) => c.name === cmd);
      if (!entry || !exists(entry.file)) {
        return {
          content: [{ type: "text", text: `Unknown command: ${cmd}` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: read(entry.file),
          },
        ],
      };
    }

    if (name === "list_daily_loop_skills") {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              SKILLS.map((s) => ({ name: s.name, path: s.file })),
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "get_subagent_prompt") {
      const phase = args?.phase;
      const agentFile = SUBAGENTS[phase];
      if (!agentFile) {
        return {
          content: [{ type: "text", text: "Invalid phase" }],
          isError: true,
        };
      }
      const ws = args?.workspace_path || "<workspace>";
      const command = args?.command || "start-day";
      const stack = args?.integration_stack || "atlassian";
      const extra = args?.args || "";
      const explorationOut = args?.exploration_output || "";

      let prompt = `Full Repository Path: ${ws}\n\n`;
      prompt += `Follow ${agentFile} in the daily-work-loop-copilot plugin.\n`;
      prompt += `Plugin root: ${PLUGIN_ROOT}\n\n`;
      prompt += `Command: /${command}\nINTEGRATION_STACK: ${stack}\nArgs: ${extra}\n`;

      if (phase === "execution" || phase === "verification") {
        prompt += `\nExploration or draft input:\n${explorationOut}\n`;
      }
      if (exists(agentFile)) {
        prompt += `\n--- Agent spec ---\n${read(agentFile)}\n`;
      }
      if (exists(SUBAGENTS.orchestration)) {
        prompt += `\n--- Orchestration ---\n${read(SUBAGENTS.orchestration)}\n`;
      }

      return { content: [{ type: "text", text: prompt }] };
    }

    if (name === "plan_daily_status_report") {
      const days = args?.days ?? 1;
      const audience = args?.audience ?? "team";
      const stack = args?.integration_stack ?? "atlassian";
      const confluence = args?.confluence ?? false;

      const plan = {
        command: "/daily-status-report",
        command_file: "commands/daily-status-report.md",
        skill: "skills/daily-status-report/SKILL.md",
        args: `--days=${days} --audience=${audience}${confluence ? " --confluence" : ""}`,
        integration_stack: stack,
        subagents: [
          {
            phase: "exploration",
            goal: "Issues/PRs updated in window; blockers; merges",
          },
          { phase: "execution", goal: "Formatted status report" },
          { phase: "verification", goal: "Scope and facts check" },
        ],
        stack_mcp:
          stack === "github"
            ? "plugin-github-github"
            : "plugin-atlassian-atlassian",
        confluence_note: confluence
          ? "Also load Atlassian generate-status-report skill; draft before publish"
          : "Chat-only report unless user passes --confluence",
        mcp_tools_hint: [
          "get_subagent_prompt(exploration|execution|verification)",
          "get_daily_loop_command(daily-status-report)",
        ],
      };

      return {
        content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (e) {
    return {
      content: [{ type: "text", text: String(e) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
