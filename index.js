const readlineSync = require('readline-sync');
const axios = require('axios');
const moment = require('moment');

let username = undefined;
let password = undefined;
let increments = undefined;


const getUserName = () => {
    return readlineSync.question('username: ');
};

const getPassword = () => {
    return readlineSync.question('password: ');
};

const getIncrements = () => {
    return readlineSync.question('increments: ');
}

const main = async () => {
    username = getUserName();
    password = getPassword();
    increments = Number(getIncrements());

    if (username && password && increments) {
        let more = false;
        let offset = 0;
        let iterator = 1;
        let requestTime = [];
        let hits = [];
        do {
            let url = `https://author-p53837-e348160.adobeaemcloud.com/bin/querybuilder.json?type=dam:Asset&p.limit=${increments}&p.guessTotal=true&path=/content/dam/dm/lslpg/legacy/collateral-library&1_property=jcr:content/metadata/dc:language&1_property.value=&2_property=jcr:content/metadata/dc:format&2_property.value=&3_property=jcr:content/metadata/cq:tags&3_property.value=&group.1_daterange.property=jcr:content/jcr:lastModified&group.1_daterange.lowerBound=&group.2_daterange.property=jcr:created&group.2_daterange.lowerBound=&p.offset=${offset}`
            console.log(`Making a request to ${url}`);

            let start = moment();
            console.log(`Start time is ${start}`)
            let response = {}
            try {
                response = await axios.get(url, {
                    auth: {
                        username: username,
                        password: password
                    }
                });
            } catch (e) {
                console.error('Failed to process request terminating application', e);
                process.exit(1);
            }
            let end = moment();
            console.log(`End time is ${end}`)
            more = response.data.more;
            hits = [...hits, ...response.data.hits]

            console.log(`The request took ${end.diff(start, 'seconds', true)} seconds to complete`);
            requestTime.push(end.diff(start, 'seconds', true));
            more ? console.log(`There are more requests to be made will continue until complete`) : console.log(`There are no more requests to be stopping the process`);
            offset = offset + increments;
            iterator = iterator + 1;
            console.log("")

        } while (more)
        console.log(`It took ${iterator} requests to complete getting all the assets`);
        console.log(`The total number of assets retrieved is ${hits.length}`)
    }
}

main();