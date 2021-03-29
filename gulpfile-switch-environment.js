const build = require('@microsoft/sp-build-web');
const logging = require('@microsoft/gulp-core-build');
const fs = require('fs');
const decomment = require('decomment');
const chalk = require('chalk');

const packageFilePath = './config/package-solution.json';
const configFilePath = './config/config.json';
const appSettingsFilePath = "./src/settings/environmentSettings.json";
const appSettingsEnvConfigFilePath = "./src/settings/environmentSettings-transform.json";


const defaultEnvironmentName = "default";

var switchEnvTask = build.task('switch-env', {
    execute: (config) => {
        return new Promise((resolve, reject) => {
            if (config.args['_'] && config.args['_'].some(a => a === 'serve')) {
                logging.log('Skipping switch-env task in order to avoid infinite reload. Run switch-env task individually before using serve.');
                resolve();
            }
            else {
                /* Retrieve the arguments */
                const env = config.args['env'] || defaultEnvironmentName;
                const check = config.args['check'] || false;

                  /* PACKAGE SETTINGS PART */
                // Retrieve the package solution file
                logging.log(`Get Package settings for environment: ${env}`);
                let pkgSolJSON = JSON.parse(fs.readFileSync(packageFilePath));

                /*CONFIG SETTINGS PART */
                 // Retrieve the config file
                 logging.log(`Get config settings for environment: ${env}`);
                let configJSON = JSON.parse(fs.readFileSync(configFilePath));

                 /* APP SETTINGS PART */
                // Retrieve the appsettings file
                logging.log(`Get apps settings for environment: ${env}`);
                let appSettingsJSON = JSON.parse(fs.readFileSync(appSettingsFilePath));

                // Get the appSettings 
                let appSettingsConfigJSON = {
                    environments: []
                };

                // Retrieve the environment information from the app settings file if it exists
                if (fs.existsSync(appSettingsEnvConfigFilePath)) {
                    const contents = fs.readFileSync(appSettingsEnvConfigFilePath);
                    if (contents.length > 0) {
                        appSettingsConfigJSON = JSON.parse(contents);
                    }
                }

                /* Check if the user wants to log the environment information */
                  if (check) {
                    logging.log(`Write default configuration from existing solution: ${env}`);
                    // Start the environment logging
                    //environmentLogging();
                    const devEntries = getDevEntries(configJSON);
                    // Store the current settings as the default
                    storeEnvironmentSettings(appSettingsConfigJSON, pkgSolJSON, devEntries, env);
                    // Complete the task
                    resolve();
                    return;
                  }
                
                // Store the current environment appsettings
                let envAppSettings = appSettingsConfigJSON.environments.find(el => el.environment == env);
                if (appSettingsConfigJSON.environments.length === 0 || !envAppSettings) {
                    //update appSettings
                    logging.log(`Configuring application settings for environment: ${env}`);
                    updateAppSettingsEnvironmentSettings(appSettingsConfigJSON, appSettingsJSON, env);
                    logging.log(`Updating apps settings file: ${packageFilePath}`);
                    fs.writeFileSync(appSettingsEnvConfigFilePath, JSON.stringify(appSettingsConfigJSON, null, 2));
                }

                 //update package settings
                 updatePackageSetting(appSettingsConfigJSON,pkgSolJSON,env);

                 //update manifest ids for SharePoint SPFX artefact (webpart/extension)
                updateManifestSetting(appSettingsConfigJSON,configJSON,env);
              
                // Write app settings to the file
                logging.log(`Updating apps settings file: ${packageFilePath}`);
                fs.writeFileSync(appSettingsFilePath, JSON.stringify((envAppSettings && envAppSettings.properties) || appSettingsJSON, null, 2));

                resolve();
            }
        });
    }
});

/**
 * 
 * @param {*} pkgSettingsJSON 
 * @param {*} pkgSolJSON 
 * @param {*} env 
 */
function updatePackageSetting(pkgSettingsJSON,pkgSolJSON,env){
// Retrieve of create the environment information
logging.log(`Configuring package settings for environment: ${env}`);
const crntEnv = getEnvironmentInfo(pkgSettingsJSON, env);
logging.log(`Updating solution package file : ${packageFilePath}`);
logging.log(chalk.green(`OLD: ${pkgSolJSON.solution.name} - NEW: ${crntEnv.properties.name}`));
pkgSolJSON.solution.name = crntEnv.properties.name;
logging.log(chalk.green(`OLD: ${pkgSolJSON.solution.id} - NEW: ${crntEnv.properties.id}`));
pkgSolJSON.solution.id = crntEnv.properties.id;
logging.log(chalk.green(`OLD: ${pkgSolJSON.paths.zippedPackage} - NEW: ${crntEnv.properties.zip}`));
pkgSolJSON.paths.zippedPackage = crntEnv.properties.zip;

if(crntEnv.properties.apiResourceName != null) {
  logging.log(chalk.green(`OLD: ${pkgSolJSON.solution.webApiPermissionRequests[0].resource} - NEW: ${crntEnv.properties.apiResourceName}`));
  pkgSolJSON.solution.webApiPermissionRequests[0].resource = crntEnv.properties.apiResourceName;
}
if(crntEnv.properties.apiResourceScope != null) {
  logging.log(chalk.green(`OLD: ${pkgSolJSON.solution.webApiPermissionRequests[0].scope} - NEW: ${crntEnv.properties.apiResourceScope}`));
  pkgSolJSON.solution.webApiPermissionRequests[0].scope = crntEnv.properties.apiResourceScope;
}

// Write the package information to the JSON file
logging.log(`Updating package solution file: ${packageFilePath}`);
fs.writeFileSync(packageFilePath, JSON.stringify(pkgSolJSON, null, 2));
}

function updateManifestSetting(appSettingsJSON,configJSON,env){
  // Retrieve of create the environment information
  logging.log(`Configuring config settings for environment: ${env}`);
  const crntEnv = getEnvironmentInfo(appSettingsJSON, env);
 

  // Update all the IDs in the manifest files
  crntEnv.properties.entries.forEach(entry => {
    const manifestContent = fs.readFileSync(entry.location, 'utf8');
    const manifestJSON = JSON.parse(decomment(manifestContent));
    if (manifestJSON.id !== entry.id) {
      logging.log(`Updating ID in the manifest file: ${entry.location}`);
      logging.log(chalk.green(`OLD: ${manifestJSON.id} - NEW: ${entry.id}`));
      manifestJSON.id = entry.id;
      fs.writeFileSync(entry.location, JSON.stringify(manifestJSON, null, 2));
    }
  });
}

/**
 * Function that will store the environment app settings information
 *
 * @param {*} settingsJSON
 * @param {*} settingsEntries
 * @param {string} env
 */
function updateAppSettingsEnvironmentSettings(settingsJSON, settingsEntries, env) {
  logging.log(`Updating setting solution file: ${packageFilePath}`);
    let envIndex = settingsJSON.environments.findIndex((el) => el.environment == env);

    // Not found
    if (envIndex == -1) {
        settingsJSON.environments.push({
            environment: env,
            properties: settingsEntries
        });
    }
    else {
        settingsJSON.environments[envIndex].properties = settingsEntries;
    }
}

/**
 * Function which returns the environment information for the specified environment
 *
 * @param {*} settingsJSON
 * @param {*} solutionJSON
 * @param {string} cdnPath
 * @param {string} env
 */
function getEnvironmentInfo(settingsJSON, env) {
    // Check if the environment information exists
    let envAppSettings = settingsJSON.environments.find(el => el.environment == env);
    if (envAppSettings == null) { //take defualt one
      envAppSettings = settingsJSON.environments.find(el => el.environment == defaultEnvironmentName);
    }
   
    return envAppSettings;
}

/**
 * Function to retrieve all developer manifests of your webparts and extensions
 *
 * @param {*} configJSON
 */
function getDevEntries(configJSON) {
  let entries = [];

  if (configJSON.bundles) {
    logging.log(`Found the following developer entries:`);

    for (const bundleName in configJSON.bundles) {
      const bundle = configJSON.bundles[bundleName];
      if (typeof bundle.components !== "undefined") {
        // Loop over all the component manifests
        bundle.components.forEach(component => {
          // Check if the manifest property exist
          if (typeof component.manifest !== "undefined") {
            // Check if the manifest file exists
            if (fs.existsSync(component.manifest)) {
              const manifestCnts = fs.readFileSync(component.manifest, 'utf8');
              if (manifestCnts.length > 0) {
                const manifest = JSON.parse(decomment(manifestCnts));
                logging.log(`- ${manifest.id}`);
                entries.push({
                  id: manifest.id,
                  location: component.manifest
                });
              }
            }
          }
        });
      }
    }
  }

  return entries;
}

/**
 * Function that will store the environment information to a seperate JSON file
 *
 * @param {*} settingsJSON
 * @param {*} solutionJSON
 * @param {string} cdnPath
 * @param {*} devEntries
 * @param {string} env
 */
function storeEnvironmentSettings(settingsJSON, solutionJSON, devEntries, env) {
  let found = false;

  // Loop and update the environment record
  for (let i = 0; i < settingsJSON.environments.length; i++) {
    let crntEnv = settingsJSON.environments[i];
    if (crntEnv.environment === env) {
      crntEnv.properties.id = solutionJSON.solution.id;
      crntEnv.properties.name = solutionJSON.solution.name;
      crntEnv.properties.zip = solutionJSON.paths.zippedPackage;
      crntEnv.properties.entries = devEntries;
      found = true;
    }
  }

  // If the current environment was not find, we will add it
  if (!found) {
    settingsJSON.environments.push({
      environment: env,
      properties: {
        id: solutionJSON.solution.id,
        name: solutionJSON.solution.name,
        zip: solutionJSON.paths.zippedPackage,
        entries: devEntries
      }    
    });
  }

  fs.writeFileSync(appSettingsFilePath, JSON.stringify(settingsJSON, null, 2))
}

exports.default = switchEnvTask;