#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Find the project root by looking for both .git and .claude directories
 */
function findProjectRoot(startDir = process.cwd()) {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    const gitPath = path.join(currentDir, '.git');
    const claudePath = path.join(currentDir, '.claude');

    if (fs.existsSync(gitPath) && fs.existsSync(claudePath)) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find project root (directory with both .git and .claude)');
}

/**
 * Ensure .gitignore exists in .deleted/ directory that ignores all files
 */
function ensureDeletedGitignore(deletedDir) {
  // Ensure the .deleted directory exists
  fs.mkdirSync(deletedDir, { recursive: true });

  const gitignorePath = path.join(deletedDir, '.gitignore');

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*\n!.gitignore\n', 'utf8');
  }
}

/**
 * Recursively copy a directory
 */
function copyDirRecursive(src, dest) {
  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });

  // Read all entries in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Move a file or directory to the .deleted directory, preserving its directory structure
 */
function moveToDeleted(targetPath, projectRoot) {
  // Resolve to absolute path
  const absolutePath = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(process.cwd(), targetPath);

  // Check if target exists
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Warning: Path does not exist, skipping: ${targetPath}`);
    return false;
  }

  const stats = fs.statSync(absolutePath);
  const isDirectory = stats.isDirectory();

  // Get relative path from project root
  const relativePath = path.relative(projectRoot, absolutePath);

  // Create destination path in .deleted/
  const deletedDir = path.join(projectRoot, '.deleted');
  const destPath = path.join(deletedDir, relativePath);

  // Ensure .gitignore exists in .deleted/
  ensureDeletedGitignore(deletedDir);

  if (isDirectory) {
    // If destination exists, remove it first (to overwrite)
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    // Copy directory recursively, then remove original
    copyDirRecursive(absolutePath, destPath);
    fs.rmSync(absolutePath, { recursive: true, force: true });

    console.log(`Moved directory: ${relativePath} -> .deleted/${relativePath}`);
  } else {
    // For files, create parent directory structure
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });

    // Move the file (rename will overwrite if destination exists)
    fs.renameSync(absolutePath, destPath);

    console.log(`Moved file: ${relativePath} -> .deleted/${relativePath}`);
  }

  return true;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node delete-file.js <file1> [file2] [file3] ...');
    process.exit(1);
  }

  try {
    const projectRoot = findProjectRoot();
    console.log(`Project root: ${projectRoot}`);
    console.log('');

    let successCount = 0;
    let failCount = 0;

    for (const filePath of args) {
      if (moveToDeleted(filePath, projectRoot)) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('');
    console.log(`Completed: ${successCount} moved, ${failCount} skipped`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
