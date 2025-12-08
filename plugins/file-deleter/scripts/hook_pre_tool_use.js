#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Get project root from CLAUDE_PROJECT_DIR environment variable.
 * Falls back to finding .claude directory if not set.
 */
function getProjectRoot() {
  // First, try environment variable
  const envRoot = process.env.CLAUDE_PROJECT_DIR;
  if (envRoot) {
    return envRoot;
  }

  // Fallback: find .claude directory
  let current = path.resolve(process.cwd());

  while (current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, '.claude'))) {
      return current;
    }
    current = path.dirname(current);
  }

  // Last resort: current directory
  return process.cwd();
}

/**
 * Comprehensive detection of dangerous rm commands.
 * Matches various forms of rm -rf and similar destructive patterns.
 */
function isDangerousRmCommand(command) {
  // Normalize command by removing extra spaces and converting to lowercase
  const normalized = command.toLowerCase().replace(/\s+/g, ' ');

  // Pattern 1: Standard rm -rf variations
  const patterns = [
    /\brm\s+.*-[a-z]*r[a-z]*f/,  // rm -rf, rm -fr, rm -Rf, etc.
    /\brm\s+.*-[a-z]*f[a-z]*r/,  // rm -fr variations
    /\brm\s+--recursive\s+--force/,  // rm --recursive --force
    /\brm\s+--force\s+--recursive/,  // rm --force --recursive
    /\brm\s+-r\s+.*-f/,  // rm -r ... -f
    /\brm\s+-f\s+.*-r/,  // rm -f ... -r
  ];

  // Check for dangerous patterns
  for (const pattern of patterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  // Pattern 2: Check for rm with recursive flag targeting dangerous paths
  const dangerousPaths = [
    /\//,           // Root directory
    /\/\*/,         // Root with wildcard
    /~/,            // Home directory
    /~\//,          // Home directory path
    /\$HOME/,       // Home environment variable
    /\.\./,         // Parent directory references
    /\*/,           // Wildcards in general rm -rf context
    /\./,           // Current directory
    /\.\s*$/,       // Current directory at end of command
  ];

  if (/\brm\s+.*-[a-z]*r/.test(normalized)) {  // If rm has recursive flag
    for (const pathPattern of dangerousPaths) {
      if (pathPattern.test(normalized)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if any tool is trying to access .env files containing sensitive data.
 */
function isEnvFileAccess(toolName, toolInput) {
  if (['Read', 'Edit', 'MultiEdit', 'Write', 'Bash'].includes(toolName)) {
    // Check file paths for file-based tools
    if (['Read', 'Edit', 'MultiEdit', 'Write'].includes(toolName)) {
      const filePath = toolInput.file_path || '';
      if (filePath.includes('.env') && !filePath.endsWith('.env.sample')) {
        return true;
      }
    }

    // Check bash commands for .env file access
    else if (toolName === 'Bash') {
      const command = toolInput.command || '';
      // Pattern to detect .env file access (but allow .env.sample)
      const envPatterns = [
        /\b\.env\b(?!\.sample)/,  // .env but not .env.sample
        /cat\s+.*\.env\b(?!\.sample)/,  // cat .env
        /echo\s+.*>\s*\.env\b(?!\.sample)/,  // echo > .env
        /touch\s+.*\.env\b(?!\.sample)/,  // touch .env
        /cp\s+.*\.env\b(?!\.sample)/,  // cp .env
        /mv\s+.*\.env\b(?!\.sample)/,  // mv .env
      ];

      for (const pattern of envPatterns) {
        if (pattern.test(command)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Main function
 */
function main() {
  try {
    // Read JSON input from stdin
    let inputData = '';

    // Check if stdin is available
    if (process.stdin.isTTY) {
      // No stdin available
      process.exit(0);
    }

    const chunks = [];
    process.stdin.on('data', (chunk) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      try {
        inputData = Buffer.concat(chunks).toString();
        const data = JSON.parse(inputData);

        const toolName = data.tool_name || '';
        const toolInput = data.tool_input || {};

        // Check for .env file access (blocks access to sensitive environment files)
        if (isEnvFileAccess(toolName, toolInput)) {
          console.error("BLOCKED: Access to .env files containing sensitive data is prohibited");
          console.error("Use .env.sample for template files instead");
          process.exit(2);  // Exit code 2 blocks tool call and shows error to Claude
        }

        // Check for dangerous rm -rf commands
        if (toolName === 'Bash') {
          const command = toolInput.command || '';

          // Block rm -rf commands with comprehensive pattern matching
          if (isDangerousRmCommand(command)) {
            console.error("BLOCKED: Dangerous rm command detected and prevented");
            console.error("");
            console.error("Use the 'file-deleter' skill instead to safely move files to .deleted/ folder.");
            console.error("The skill will preserve directory structure and allow recovery if needed.");
            process.exit(2);  // Exit code 2 blocks tool call and shows error to Claude
          }
        }

        process.exit(0);

      } catch (e) {
        // Handle JSON parse errors gracefully
        process.exit(0);
      }
    });

  } catch (e) {
    // Handle any other errors gracefully
    process.exit(0);
  }
}

main();
