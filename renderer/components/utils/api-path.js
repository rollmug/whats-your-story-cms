
const apiPathFormat = async (appSettings) => {
    var publicUrl, apiEndpoint;

    if (appSettings.domain === "localhost") {
        if (appSettings.port == 80) {
            publicUrl = "http://localhost";
            apiEndpoint = "http://localhost/graphql";
        } else {
            publicUrl = `http://localhost:${appSettings.port}`;
            apiEndpoint = `http://localhost:${appSettings.port}/graphql`;
        }
    } else {
        if (appSettings.port == 80) {
            publicUrl = appSettings.domain;
            apiEndpoint = `${appSettings.domain}/graphql`;
        } else {
            publicUrl = `${appSettings.domain}:${appSettings.port}`;
            apiEndpoint = `${appSettings.domain}:${appSettings.port}/graphql`;
        }
    }

    return { publicUrl, apiEndpoint }
}

export default apiPathFormat;