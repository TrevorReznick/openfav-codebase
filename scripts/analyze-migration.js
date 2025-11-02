const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

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
if (!fs.existsSync(path.dirname(config.logFile))) {
  fs.mkdirSync(path.dirname(config.logFile), { recursive: true });
}

// Logger function
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    process.stdout.write(logMessage);
    fs.appendFileSync(config.logFile, logMessage);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}\n`;
    process.stderr.write(`\x1b[31m${errorMessage}\x1b[0m`);
    fs.appendFileSync(config.logFile, `ERROR: ${errorMessage}`);
  },
  section: (title) => {
    const separator = '='.repeat(80);
    const section = `\n${separator}\n${title}\n${separator}\n`;
    process.stdout.write(`\n\x1b[36m${section}\x1b[0m`);
    fs.appendFileSync(config.logFile, `\n${section}`);
  }
};

// Helper functions
const analyzeDirectory = (dirPath, baseDir = '') => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.map(entry => {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(baseDir, entry.name);
      
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          type: 'directory',
          path: relativePath,
          children: analyzeDirectory(fullPath, relativePath)
        };
      } else {
        const stats = fs.statSync(fullPath);
        return {
          name: entry.name,
          type: 'file',
          path: relativePath,
          size: stats.size,
          modified: stats.mtime
        };
      }
    });
  } catch (error) {
    logger.error(`Error analyzing directory ${dirPath}: ${error.message}`);
    return [];
  }
};

const countFileTypes = (dir) => {
  const extensions = new Map();
  
  const countInDir = (dirPath) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        countInDir(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase() || '.none';
        extensions.set(ext, (extensions.get(ext) || 0) + 1);
      }
    }
  };
  
  countInDir(dir);
  return Object.fromEntries(extensions.entries());
};

// Main analysis function
const analyzeProject = (projectPath, projectName) => {
  logger.section(`Analyzing ${projectName} (${projectPath})`);
  
  // Basic project info
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      logger.log(`Project: ${pkg.name || 'N/A'}`);
      logger.log(`Version: ${pkg.version || 'N/A'}`);
      logger.log(`Description: ${pkg.description || 'N/A'}`);
      logger.log(`Main entry: ${pkg.main || 'N/A'}`);
      
      // Dependencies
      logger.log(`\nDependencies (${Object.keys(pkg.dependencies || {}).length}):`);
      logger.log(Object.keys(pkg.dependencies || {}).join(', '));
      
      logger.log(`\nDev Dependencies (${Object.keys(pkg.devDependencies || {}).length}):`);
      logger.log(Object.keys(pkg.devDependencies || {}).join(', '));
    } catch (error) {
      logger.error(`Error reading package.json: ${error.message}`);
    }
  }
  
  // Directory structure
  logger.section(`Directory Structure (${projectName})`);
  const structure = analyzeDirectory(projectPath);
  logger.log(JSON.stringify(structure, null, 2));
  
  // File type analysis
  logger.section(`File Type Analysis (${projectName})`);
  const fileTypes = countFileTypes(projectPath);
  logger.log(JSON.stringify(fileTypes, null, 2));
  
  return { structure, fileTypes };
};

// Compare projects
const compareProjects = (source, dest) => {
  logger.section('Migration Analysis');
  
  // Check for missing directories in destination
  logger.log('\nChecking for missing directories in destination:');
  const findDirectories = (dir) => {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  };
  
  const sourceDirs = findDirectories(path.join(source, 'src'));
  const destDirs = findDirectories(path.join(dest, 'src'));
  
  const missingDirs = sourceDirs.filter(dir => !destDirs.includes(dir));
  if (missingDirs.length > 0) {
    logger.log('The following directories exist in source but are missing in destination:');
    missingDirs.forEach(dir => logger.log(`- ${dir}`));
  } else {
    logger.log('All source directories exist in destination.');
  }
  
  // Check for potential migration issues
  logger.log('\nPotential Migration Issues:');
  
  // Check for CSS-in-JS usage
  const hasCssInJs = (dir) => {
    const jsxFiles = [];
    
    const findJsxFiles = (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          findJsxFiles(fullPath);
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx')) {
          jsxFiles.push(fullPath);
        }
      }
    };
    
    findJsxFiles(dir);
    
    // Check for common CSS-in-JS patterns
    const patterns = [
      'styled-components',
      'emotion',
      'css`',
      'createGlobalStyle',
      'injectGlobal',
      'withStyles',
      'makeStyles',
      'createStyles',
      'css={',
      'className={'
    ];
    
    const results = [];
    
    for (const file of jsxFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const matches = patterns.filter(pattern => content.includes(pattern));
        
        if (matches.length > 0) {
          results.push({
            file: path.relative(dir, file),
            patterns: matches
          });
        }
      } catch (error) {
        logger.error(`Error reading file ${file}: ${error.message}`);
      }
    }
    
    return results;
  };
  
  const sourceCssInJs = hasCssInJs(path.join(source, 'src'));
  if (sourceCssInJs.length > 0) {
    logger.log('\nPotential CSS-in-JS usage found in source project:');
    sourceCssInJs.forEach(result => {
      logger.log(`- ${result.file}:`);
      result.patterns.forEach(pattern => logger.log(`  - ${pattern}`));
    });
  }
  
  // Check for deprecated APIs
  const checkDeprecatedApis = (dir) => {
    const deprecatedPatterns = [
      'componentWillMount',
      'componentWillReceiveProps',
      'UNSAFE_',
      'findDOMNode',
      'createRef',
      'componentWillUpdate',
      'UNSAFE_componentWillUpdate'
    ];
    
    const results = [];
    
    const checkFile = (filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = deprecatedPatterns.filter(pattern => content.includes(pattern));
        
        if (matches.length > 0) {
          results.push({
            file: path.relative(dir, filePath),
            patterns: matches
          });
        }
      } catch (error) {
        logger.error(`Error checking file ${filePath}: ${error.message}`);
      }
    };
    
    const walkDir = (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name.match(/\.(js|jsx|ts|tsx)$/)) {
          checkFile(fullPath);
        }
      }
    };
    
    walkDir(dir);
    return results;
  };
  
  const deprecatedApis = checkDeprecatedApis(path.join(source, 'src'));
  if (deprecatedApis.length > 0) {
    logger.log('\nDeprecated React APIs found in source project:');
    deprecatedApis.forEach(result => {
      logger.log(`- ${result.file}:`);
      result.patterns.forEach(pattern => logger.log(`  - ${pattern}`));
    });
  }
  
  // Check for third-party dependencies that might need migration
  const checkDependencies = (pkgPath) => {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies
      };
      
      const problematicDeps = [
        { name: 'react-router', version: '[1-4]' },
        { name: 'react-router-dom', version: '[1-4]' },
        { name: 'redux', version: '[1-6]' },
        { name: 'react-redux', version: '[1-7]' },
        { name: 'mobx', version: '[1-5]' },
        { name: 'mobx-react', version: '[1-6]' },
        { name: 'enzyme', version: '.*' },
        { name: 'create-react-class', version: '.*' },
        { name: 'prop-types', version: '.*' },
        { name: 'react-scripts', version: '[1-4]' },
        { name: 'webpack', version: '[1-4]' },
        { name: 'babel-core', version: '.*' },
        { name: 'babel-preset-react-app', version: '.*' },
        { name: 'react-scripts-ts', version: '.*' },
        { name: 'ts-jest', version: '[1-3]' },
        { name: 'jest', version: '[1-25]' },
        { name: 'react-test-renderer', version: '[1-17]' },
        { name: 'react-dom', version: '[1-16]' },
        { name: 'react', version: '[1-16]' }
      ];
      
      const foundDeps = [];
      
      for (const [name, version] of Object.entries(deps)) {
        for (const pattern of problematicDeps) {
          if (name === pattern.name) {
            if (!pattern.version || version.match(new RegExp(pattern.version))) {
          const [pkgName, versionRange] = pattern.split('@');
          
          if (name === pkgName) {
            if (!versionRange || version.match(new RegExp(versionRange))) {
              foundDeps.push(`${name}@${version}`);
            }
          }
        }
      }
      
      return foundDeps;
    } catch (error) {
      logger.error(`Error checking dependencies: ${error.message}`);
      return [];
    }
  };
  
  const sourcePkgPath = path.join(source, 'package.json');
  const problematicDeps = checkDependencies(sourcePkgPath);
  
  if (problematicDeps.length > 0) {
    logger.log('\nPotentially problematic dependencies found in source project:');
    problematicDeps.forEach(dep => logger.log(`- ${dep}`));
  }
  
  // Check for environment variables
  const checkEnvFiles = (dir) => {
    const envFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      '.env.test'
    ];
    
    const foundFiles = [];
    
    for (const file of envFiles) {
      const filePath = path.join(dir, file);
      
      if (fs.existsSync(filePath)) {
        foundFiles.push(file);
      }
    }
    
    return foundFiles;
  };
  
  const envFiles = checkEnvFiles(source);
  if (envFiles.length > 0) {
    logger.log('\nEnvironment files found in source project:');
    envFiles.forEach(file => logger.log(`- ${file}`));
    logger.log('\nNote: Make sure to review and migrate any environment variables to the new project.');
  }
  
  // Check for TypeScript usage
  const checkTypeScript = (dir) => {
    const tsConfigPath = path.join(dir, 'tsconfig.json');
    const hasTsConfig = fs.existsSync(tsConfigPath);
    
    const tsFiles = [];
    
    const findTsFiles = (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          findTsFiles(fullPath);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          tsFiles.push(path.relative(dir, fullPath));
        }
      }
    };
    
    findTsFiles(path.join(dir, 'src'));
    
    return {
      hasTsConfig,
      tsFiles,
      hasTypeScript: hasTsConfig || tsFiles.length > 0
    };
  };
  
  const sourceTsInfo = checkTypeScript(source);
  const destTsInfo = checkTypeScript(dest);
  
  if (sourceTsInfo.hasTypeScript) {
    logger.log('\nTypeScript Usage:');
    logger.log(`- Source project ${sourceTsInfo.hasTsConfig ? 'has' : 'does not have'} a tsconfig.json`);
    logger.log(`- Found ${sourceTsInfo.tsFiles.length} TypeScript files in source project`);
    
    if (destTsInfo.hasTypeScript) {
      logger.log('- Destination project already has TypeScript configured');
    } else {
      logger.log('- Note: Destination project does not appear to have TypeScript configured');
    }
  }
  
  // Generate migration recommendations
  logger.section('Migration Recommendations');
  
  if (missingDirs.length > 0) {
    logger.log('1. Create missing directories in the destination project:');
    missingDirs.forEach(dir => {
      logger.log(`   - mkdir -p ${path.join('src', dir)}`);
    });
    logger.log('');
  }
  
  if (sourceCssInJs.length > 0) {
    logger.log('2. Plan for CSS-in-JS migration:');
    logger.log('   - Review the CSS-in-JS patterns found in the source project');
    logger.log('   - Consider migrating to a CSS Modules or Tailwind CSS approach');
    logger.log('   - Update any component styles to use the new styling system');
    logger.log('');
  }
  
  if (deprecatedApis.length > 0) {
    logger.log('3. Update deprecated React APIs:');
    logger.log('   - Replace componentWillMount, componentWillReceiveProps, etc. with modern alternatives');
    logger.log('   - Consider using functional components with hooks where appropriate');
    logger.log('');
  }
  
  if (problematicDeps.length > 0) {
    logger.log('4. Update or replace problematic dependencies:');
    logger.log('   - Review the list of potentially problematic dependencies');
    logger.log('   - Update to the latest stable versions or find modern alternatives');
    logger.log('   - Pay special attention to React Router, Redux, and other major dependencies');
    logger.log('');
  }
  
  if (envFiles.length > 0) {
    logger.log('5. Migrate environment variables:');
    logger.log('   - Review the environment files in the source project');
    logger.log('   - Create corresponding .env files in the destination project');
    logger.log('   - Update any build or deployment configurations that reference these variables');
    logger.log('');
  }
  
  if (sourceTsInfo.hasTypeScript && !destTsInfo.hasTypeScript) {
    logger.log('6. Set up TypeScript in the destination project:');
    logger.log('   - Install TypeScript and related dependencies:');
    logger.log('     npm install --save-dev typescript @types/react @types/react-dom @types/node');
    logger.log('   - Create a tsconfig.json file with appropriate configuration');
    logger.log('   - Rename .js/.jsx files to .ts/.tsx as needed');
    logger.log('');
  }
  
  logger.log('7. General migration steps:');
  logger.log('   - Set up the basic project structure if not already done');
  logger.log('   - Install required dependencies');
  logger.log('   - Migrate components one by one, testing as you go');
  logger.log('   - Set up routing and navigation');
  logger.log('   - Implement state management if needed');
  logger.log('   - Set up testing');
  logger.log('   - Configure build and deployment');
  logger.log('   - Test thoroughly on different devices and browsers');
  logger.log('   - Update documentation');
  logger.log('');
  
  logger.log('8. Post-migration tasks:');
  logger.log('   - Run tests and fix any issues');
  logger.log('   - Perform code review');
  logger.log('   - Test performance and optimize as needed');
  logger.log('   - Update CI/CD pipelines');
  logger.log('   - Plan for deployment and rollback strategy');
  logger.log('');
};

// Main function
const main = () => {
  try {
    // Clear log file
    fs.writeFileSync(config.logFile, '');
    
    logger.section('Migration Analysis Tool');
    logger.log(`Started at: ${new Date().toISOString()}\n`);
    
    // Analyze source project
    if (!fs.existsSync(config.source)) {
      throw new Error(`Source directory not found: ${config.source}`);
    }
    
    // Analyze destination project
    if (!fs.existsSync(config.destination)) {
      throw new Error(`Destination directory not found: ${config.destination}`);
    }
    
    // Analyze both projects
    logger.section('Source Project Analysis');
    analyzeProject(config.source, 'Source Project');
    
    logger.section('Destination Project Analysis');
    analyzeProject(config.destination, 'Destination Project');
    
    // Compare projects
    compareProjects(config.source, config.destination);
    
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
