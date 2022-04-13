const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, ".env")).toString().replace("\r", "").split("\n").reduce((prev, curr) => {
    if(curr.indexOf("=") > -1) {
        const [key, value] = curr.split("=");
        prev[key] = value.replace("\r", "").trim();
    }
    return prev;
}, {});

const scrapings =     [
    {
        "user": "nao_precisa_login",
        "portal": "vallourec",
    },
    {
        "user": "US204683",
        "portal": "usiminas",
    },
    {
        "user": "97609745",
        "portal": "arcellor",
    },
    {
        "user": "70053133",
        "portal": "arcellor",
    },
    {
        "user": "C59740",
        "portal": "magnesita",
    },
    {
        "user": "70059654",
        "portal": "arcellor",
    },
    {
        "user": "70032277",
        "portal": "arcellor",
    }
];

const pythonInterpreter = path.join(__dirname,"venv", "Scripts", "pythonw");
const apps = scrapings.map(scraping => (
    {
        name   : `SCRAPING ${scraping.portal} ${scraping.user}`.toUpperCase(),
        interpreter : pythonInterpreter,
        cwd: path.join(__dirname, `scraping_${scraping.portal}`),
        script : "main.py",
        env: {...env, PORTAL: scraping.portal, LOGIN: scraping.user},
    }
));

apps.push({
    name   : `SCRAPING EMAIL USIMINAS`,
    interpreter : pythonInterpreter,
    cwd: path.join(__dirname, `email_usiminas`),
    script : "main.py",
    env: env,
});

apps.push({
    name   : `SCRAPING EMAIL FIAT`,
    interpreter : pythonInterpreter,
    cwd: path.join(__dirname, `email_fiat`),
    script : "main.py",
    env: env,
});

module.exports = {
    apps : apps
}