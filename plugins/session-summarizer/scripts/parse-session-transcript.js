#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

/**
 * Parse Claude Code session transcript JSONL file
 * Extracts meaningful conversation content excluding system messages and metadata
 */

async function parseTranscript(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const output = [];

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const entry = JSON.parse(line);

      // Skip file history snapshots
      if (entry.type === 'file-history-snapshot') continue;

      // Skip system messages that aren't part of the conversation
      if (entry.type === 'system' && entry.subtype === 'local_command') continue;
      if (entry.type === 'system' && entry.subtype === 'internal') continue;

      // Process user messages (but skip tool results)
      if (entry.type === 'user' && entry.message) {
        const content = entry.message.content;

        // Check if this is actually a tool result
        if (Array.isArray(content) && content.length > 0 && content[0].type === 'tool_result') {
          // This is a tool result, handle it separately
          for (const toolResult of content) {
            if (toolResult.type === 'tool_result') {
              const toolUseId = toolResult.tool_use_id || 'unknown';

              // Check if this is a Task (subagent) tool result
              const isTaskResult = entry.toolUseResult && entry.toolUseResult.agentId;

              if (isTaskResult) {
                // Extract subagent response
                output.push(`\nSubagent Response (${entry.slug || toolUseId}):`);

                const resultContent = toolResult.content;
                if (Array.isArray(resultContent)) {
                  // Extract text from structured content
                  for (const item of resultContent) {
                    if (item.type === 'text' && item.text) {
                      output.push(`  ${item.text.trim()}`);
                    }
                  }
                } else if (typeof resultContent === 'string') {
                  output.push(`  ${resultContent.trim()}`);
                }
              } else {
                // Regular tool result
                output.push(`\nTool Result: ${toolUseId}`);

                const resultContent = toolResult.content || '';
                const contentStr = typeof resultContent === 'string'
                  ? resultContent
                  : JSON.stringify(resultContent);

                // Truncate very long outputs
                const maxLength = 500;
                const truncated = contentStr.length > maxLength
                  ? contentStr.substring(0, maxLength) + '\n  ... (truncated)'
                  : contentStr;

                output.push(`  ${truncated.trim()}`);
              }
            }
          }
        } else {
          // Regular user message
          const contentStr = typeof content === 'string'
            ? content
            : JSON.stringify(content);
          output.push(`\nUser: ${contentStr.trim()}`);
        }
      }

      // Process assistant messages
      if (entry.type === 'assistant' && entry.message) {
        const msg = entry.message;

        // Check for thinking blocks
        const thinkingBlocks = msg.content?.filter(c => c.type === 'thinking') || [];
        const textBlocks = msg.content?.filter(c => c.type === 'text') || [];
        const toolUseBlocks = msg.content?.filter(c => c.type === 'tool_use') || [];

        // Output thinking
        for (const thinking of thinkingBlocks) {
          if (thinking.thinking) {
            output.push(`\nThinking: ${thinking.thinking.trim()}`);
          }
        }

        // Output text responses
        for (const text of textBlocks) {
          if (text.text) {
            output.push(`\nAssistant: ${text.text.trim()}`);
          }
        }

        // Output tool uses
        for (const tool of toolUseBlocks) {
          output.push(`\nTool Use: ${tool.name}`);
          if (tool.input) {
            const inputStr = JSON.stringify(tool.input, null, 2);
            output.push(`  Input: ${inputStr}`);
          }
        }
      }

      // Tool results are now handled in the user message section above

      // Process edits (file changes)
      if (entry.type === 'edit' && entry.edit) {
        const edit = entry.edit;
        output.push(`\nFile Edit: ${edit.file_path}`);
        if (edit.old_string && edit.new_string) {
          output.push(`  Changed: "${edit.old_string.substring(0, 100)}..." → "${edit.new_string.substring(0, 100)}..."`);
        }
      }

      // Process file writes
      if (entry.type === 'write' && entry.write) {
        const write = entry.write;
        output.push(`\nFile Write: ${write.file_path}`);
        const preview = write.content ? write.content.substring(0, 100) : '';
        output.push(`  Content preview: ${preview}...`);
      }

      // Process subagent spawns
      if (entry.type === 'subagent_spawn') {
        output.push(`\nSubagent Spawned: ${entry.subagent_type || 'unknown'}`);
        if (entry.prompt) {
          output.push(`  Prompt: ${entry.prompt.substring(0, 200)}...`);
        }
      }

      // Process subagent responses
      if (entry.type === 'subagent_response') {
        output.push(`\nSubagent Response:`);
        if (entry.response) {
          const respStr = typeof entry.response === 'string'
            ? entry.response
            : JSON.stringify(entry.response);
          output.push(`  ${respStr.substring(0, 300)}...`);
        }
      }

    } catch (err) {
      console.error(`Error parsing line: ${err.message}`);
    }
  }

  return output.join('\n');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node parse-session-transcript.js <path-to-jsonl>');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  parseTranscript(filePath)
    .then(output => {
      console.log('=== Claude Code Session Transcript ===');
      console.log(output);
      console.log('\n=== End of Transcript ===');
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { parseTranscript };
