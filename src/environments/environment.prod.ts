const apiURL = 'http://localhost:8080/api/v1';

export const environment = {
    production   : true,
    apiURL,
    backendRoutes: {
        importers: `${ apiURL }/importers`,
        banks    : `${ apiURL }/banks`,
        exporters: `${ apiURL }/exporters`
    }
};
