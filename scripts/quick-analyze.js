const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  source: '/home/default/develop-env/prod/openfav-migration/openfav-vibe-V1',
  destination: '/home/default/develop-env/prod/openfav-test/openfav-init',
  logFile: '/home/default/develop-env/prod/openfav-test/openfav-init/logs/migration-analysis.log'
};

// Ensure logs directory exists
const logDir = path.dirname(config.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Simple logger
const logger = {
  log: (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(config.logFile, logMessage);
    console.log(message);
  },
  section: (title) => {
    const separator = '='.repeat(80);
    const section = `\n${separator}\n${title}\n${separator}\n`;
    fs.appendFileSync(config.logFile, section);
    console.log(`\n\x1b[36m${section}\x1b[0m`);
  }
};

// Get directory contents
const getDirContents = (dir) => {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    logger.log(`Warning: Could not read directory ${dir}: ${error.message}`);
    return [];
  }
};

// Count files by extension
const countFileTypes = (dir) => {
  const count = {};
  
  const countInDir = (dirPath) => {
    const entries = getDirContents(dirPath);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        countInDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase() || '.none';
        count[ext] = (count[ext] || 0) + 1;
      }
    }
  };
  
  countInDir(dir);
  return count;
};

// Get package.json info
const getPackageInfo = (projectPath) => {
  const pkgPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    return null;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return {
      name: pkg.name,
      version: pkg.version,
      dependencies: Object.keys(pkg.dependencies || {}).length,
      devDependencies: Object.keys(pkg.devDependencies || {}).length,
      scripts: Object.keys(pkg.scripts || {})
    };
  } catch (error) {
    logger.log(`Error reading package.json: ${error.message}`);
    return null;
  }
};

// Main analysis function
const analyzeProject = (projectPath, projectName) => {
  logger.section(`Analyzing ${projectName}`);
  logger.log(`Path: ${projectPath}`);
  
  if (!fs.existsSync(projectPath)) {
    logger.log(`Error: Directory does not exist`);
    return;
  }
  
  // Get package.json info
  const pkgInfo = getPackageInfo(projectPath);
  if (pkgInfo) {
    logger.log(`\nPackage: ${pkgInfo.name}@${pkgInfo.version}`);
    logger.log(`Dependencies: ${pkgInfo.dependencies}`);
    logger.log(`Dev Dependencies: ${pkgInfo.devDependencies}`);
    logger.log(`Scripts: ${pkgInfo.scripts.join(', ')}`);
  }
  
  // Count file types
  logger.log('\nFile Types:');
  const fileTypes = countFileTypes(projectPath);
  Object.entries(fileTypes).forEach(([ext, count]) => {
    logger.log(`  ${ext}: ${count}`);
  });
  
  // Check for common directories
  const commonDirs = ['src', 'public', 'components', 'pages', 'styles'];
  logger.log('\nDirectory Structure:');
  
  commonDirs.forEach(dir => {
    const dirPath = path.join(projectPath, dir);
    const exists = fs.existsSync(dirPath) ? '✓' : '✗';
    logger.log(`  ${exists} ${dir}`);
  });
};

// Main function
const main = () => {
  // Clear log file
  fs.writeFileSync(config.logFile, '');
  
  logger.section('Migration Analysis Tool');
  logger.log(`Started at: ${new Date().toISOString()}\n`);
  
  // Analyze source project
  analyzeProject(config.source, 'Source Project (V1)');
  
  // Analyze destination project
  analyzeProject(config.destination, 'Destination Project (New)');
  
  // Generate recommendations
  logger.section('Migration Recommendations');
  logger.log('1. Component Migration:');
  logger.log('   - Convert components to use shadcn/ui patterns');
  logger.log('   - Update any Radix UI components to their shadcn/ui equivalents');
  logger.log('   - Ensure all components are using Tailwind CSS for styling');
  
  logger.log('\n2. Styling:');
  logger.log('   - Review and update color theming to match the design system');
  logger.log('   - Convert any CSS-in-JS to Tailwind classes');
  logger.log('   - Ensure responsive design works as expected');
  
  logger.log('\n3. State Management:');
  logger.log('   - Review and update state management approach if needed');
  logger.log('   - Consider using React Context or a state management library');
  
  logger.log('\n4. Testing:');
  logger.log('   - Set up testing framework (Jest/Vitest)');
  logger.log('   - Write unit tests for components');
  logger.log('   - Add integration tests for critical user flows');
  
  logger.log('\n5. Performance:');
  logger.log('   - Optimize bundle size');
  logger.log('   - Implement code splitting where appropriate');
  logger.log('   - Optimize images and other assets');
  
  logger.section('Next Steps');
  logger.log('1. Review the analysis above');
  logger.log('2. Create a migration plan based on the recommendations');
  logger.log('3. Migrate components incrementally');
  logger.log('4. Test thoroughly after each migration step');
  
  logger.section('Analysis Complete');
  logger.log(`Analysis completed at: ${new Date().toISOString()}`);
  logger.log(`Log file saved to: ${config.logFile}`);
};

// Run the analysis
main();
