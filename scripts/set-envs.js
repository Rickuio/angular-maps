
const { writeFileSync, mkdirSync, mkdir, write, writeFile } = require( 'fs' )

require( 'dotenv' ).config();

const targetPath = './src/enviroments/enviroment.ts';
const targetPathDev = './src/enviroments/enviroment.development.ts';

const mapboxKey = process.env['MAPBOX_KEY'] || 'your_mapbox_access_token_here';

if ( !mapboxKey ) {
    throw new Error( 'MAPBOX_KEY is not set in .env file' );
}

const envFileContent = `
    export const environment = {
        mapboxKey: "${ mapboxKey }",
    };
`
mkdirSync( './src/enviroments', { recursive: true } );

writeFileSync( targetPath, envFileContent, { encoding: 'utf8' } );
writeFileSync( targetPathDev, envFileContent, { encoding: 'utf8' } );
