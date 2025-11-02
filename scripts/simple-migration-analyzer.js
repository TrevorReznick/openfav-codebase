const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs functions
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Configuration
const config = {
  source: '/home/default/develop-env/prod/openfav-migration/openfav-vibe-V1',
  destination: '/home/default/develop-env/prod/openfav-test/openfav-init',
  logFile: '/home/default/develop-env/prod/openfav-test/openfav-init/logs/migration-analysis.log',
  directoriesToAnalyze: [
    'src',
    'public',
    'src/components',
    'src/styles',
    'src/pages',
    'src/hooks',
    'src/lib'
  ]
};

// Ensure logs directory exists
const logDir = path.dirname(config.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logger function
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(config.logFile, logMessage);
    console.log(`[LOG] ${message}`);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}\n`;
    fs.appendFileSync(config.logFile, `ERROR: ${errorMessage}`);
    console.error(`[ERROR] ${message}`);
  },
  section: (title) => {
    const separator = '='.repeat(80);
    const section = `\n${separator}\n${title}\n${separator}\n`;
    fs.appendFileSync(config.logFile, section);
    console.log(`\n${'\x1b[36m'}${section}${'\x1b[0m'}`);
  }
};

// Get directory size
const getDirectorySize = async (dir) => {
  const files = await readdir(dir, { withFileTypes: true });
  const paths = files.map(async (file) => {
    const pathStr = path.join(dir, file.name);
    if (file.isDirectory()) return await getDirectorySize(pathStr);
    if (file.isFile()) {
      const { size } = await stat(pathStr);
      return size;
    }
    return 0;
  });
  return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
};

// Count files by extension
const countFilesByExtension = async (dir) => {
  const count = {};
  
  const processDirectory = async (dirPath) => {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase() || '.none';
        count[ext] = (count[ext] || 0) + 1;
      }
    }
  };
  
  await processDirectory(dir);
  return count;
};

// Analyze project structure
const analyzeProject = async (projectPath, projectName) => {
  logger.section(`Analyzing ${projectName} (${projectPath})`);
  
  // Check if project exists
  if (!fs.existsSync(projectPath)) {
    logger.error(`Project directory does not exist: ${projectPath}`);
    return null;
  }
  
  const result = {
    name: projectName,
    path: projectPath,
    exists: true,
    directories: {},
    fileTypes: {},
    packageJson: null,
    size: 0
  };
  
  try {
    // Get package.json info
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
      result.packageJson = {
        name: pkg.name,
        version: pkg.version,
        scripts: Object.keys(pkg.scripts || {}),
        dependencies: Object.keys(pkg.dependencies || {}).length,
        devDependencies: Object.keys(pkg.devDependencies || {}).length
      };
    }
    
    // Get directory sizes and file counts
    for (const dir of config.directoriesToAnalyze) {
      const dirPath = path.join(projectPath, dir);
      if (fs.existsSync(dirPath)) {
        const size = await getDirectorySize(dirPath);
        const fileTypes = await countFilesByExtension(dirPath);
        
        result.directories[dir] = {
          exists: true,
          size,
          fileCount: Object.values(fileTypes).reduce((sum, count) => sum + count, 0),
          fileTypes
        };
        
        // Update total size and file types
        result.size += size;
        Object.entries(fileTypes).forEach(([ext, count]) => {
          result.fileTypes[ext] = (result.fileTypes[ext] || 0) + count;
        });
      } else {
        result.directories[dir] = { exists: false };
      }
    }
    
    return result;
  } catch (error) {
    logger.error(`Error analyzing project ${projectName}: ${error.message}`);
    return null;
  }
};\n
// Compare projects
const compareProjects = (source, dest) => {
  logger.section('Migration Recommendations');
  
  // Check for missing directories
  const missingDirs = [];
  for (const dir in source.directories) {
    if (source.directories[dir].exists && !dest.directories[dir]?.exists) {
      missingDirs.push(dir);
    }
  }
  
  if (missingDirs.length > 0) {
    logger.log('1. Create missing directories in the destination project:');
    missingDirs.forEach(dir => {
      logger.log(`   - mkdir -p ${path.join('src', dir)}`);
    });
    logger.log('');
  }
  
  // Check for dependency differences
  if (source.packageJson) {
    logger.log('2. Review dependencies:');
    logger.log(`   - Source has ${source.packageJson.dependencies} dependencies`);
    logger.log(`   - Destination has ${dest.packageJson?.dependencies || 0} dependencies`);
    logger.log('   - Compare package.json files for version differences');
    logger.log('');
  }
  
  // General migration steps
  logger.log('3. General migration steps:');
  logger.log('   - Set up the basic project structure if not already done');
  logger.log('   - Install required dependencies');
  logger.log('   - Migrate components one by one, testing as you go');
  logger.log('   - Set up routing and navigation');
  logger.log('   - Implement state management if needed');
  logger.log('   - Set up testing');
  logger.log('   - Configure build and deployment');
  logger.log('   - Test thoroughly on different devices and browsers');
  logger.log('');
};

// Main function
const main = async () => {
  try {
    // Clear log file
    fs.writeFileSync(config.logFile, '');
    
    logger.section('Migration Analysis Tool');
    logger.log(`Started at: ${new Date().toISOString()}\n`);
    
    // Analyze source project
    logger.section('Analyzing Source Project');
    const source = await analyzeProject(config.source, 'Source Project');
    
    // Analyze destination project
    logger.section('Analyzing Destination Project');
    const dest = await analyzeProject(config.destination, 'Destination Project');
    
    // Compare projects
    if (source && dest) {
      compareProjects(source, dest);
    }
    
    logger.section('Analysis Complete');
    logger.log(`Analysis completed at: ${new Date().toISOString()}`);
    logger.log(`Log file saved to: ${config.logFile}`);
    
    console.log(`\n✅ Analysis complete. Check ${config.logFile} for details.`);
  } catch (error) {
    logger.error(`Fatal error: ${error.message}`);
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the analysis
main();
