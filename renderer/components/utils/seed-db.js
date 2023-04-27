import fs from 'fs-extra';
import upath from 'upath';

const seedDB = async (templateDir, appSettings) => {
    const userFile = upath.join(templateDir, "init", "02-user.sql");
    const componentsFile = upath.join(templateDir, "init", "03-components.sql");

    const spark = "'Find_Your_Spark', 'findYourSpark', 'changemakers'";
    const posters = "'Posters_For_Change', 'visitorPosters'";
    const superpower = "'SuperPower_Quiz', 'superpowerChangemakers'";

    var componentSQL = '-- any necessary collection updates'; //which will essentially empty it
    switch(appSettings.install) {
        case "all": break; //do nothing
        case "spark": 
            // hide posters and superpower
            componentSQL = `UPDATE directus_collections SET hidden=1 where collection IN (${posters}, ${superpower})`;
            break;
        case "poster":
            // hide spark and superpower
            componentSQL = `UPDATE directus_collections SET hidden=1 where collection IN (${spark}, ${superpower})`;
            break;
        case "quiz":
            // hide spark and posters
            componentSQL = `UPDATE directus_collections SET hidden=1 where collection IN (${spark}, ${posters})`;
            break;
    }

    const sql = `UPDATE directus_users SET token='${appSettings.directusAPIToken}'`;
    await fs.outputFile(userFile, sql);
    await fs.outputFile(componentsFile, componentSQL);
    return true;
}

export default seedDB;