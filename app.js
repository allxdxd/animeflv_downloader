const colors = require('colors');
const readline = require('readline');
const {download_links} = require('./modules/download_links');
const {get_links} = require('./modules/get_links');
const {download} = require('./modules/download');
const { mkdir, existsSync, readdirSync } = require('fs');

// Funtions and others
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getDifference(a, b) {
    return a.filter(element => {
      return !b.includes(element);
    });
}

async function only_links(name){

    console.log(`Name: ${name}`.yellow);
    console.log(`Searching ...\n`.yellow);

    const [number_of_caps, caps] = await get_links(name);

    if (caps.length <= 0) {

        return console.log(`Don't found, please review the name or something \n`.red);

    }else{

        console.log(`Found!`.yellow);
        console.log(`Number of caps: ${caps.length}\n`.yellow);
        console.log(`Generating links ...`.yellow);

        try {
            for (let i = 0; i < caps.length; i++) {
                let a = await download_links(caps[i]);
                console.log(`${number_of_caps[(number_of_caps.length - 1) - i].slice(5)}: ${a}`.green);
            };
        } catch (error) {
            console.log(error.red);
        }

    }
    
};

async function check_and_download(name, folder_name, result) {
    // get files in the folder
    const files = await readdirSync(folder_name);

    //compare files
    const keys = Object.keys(result);
    const cap_number = keys.map(e => e[e.length-1]);
    const file_number = files.map(e => e[e.length - 5]);
    let exist = [];
    let not_exist = [...keys];

    //existing elements
    console.log(`This chapters has been found`.yellow);
    if (file_number.length == 0) {
        console.log(`There are nothing`.red);
    }else{
        for (let i = 0; i < file_number.length; i++) {
            let ind = cap_number.indexOf(file_number[i]);
            if ( !(ind === -1)) {
                console.log(`${keys[ind]} ✔`.green);
                exist.push(keys[ind])
            };
        };
    }

    // no existing elements

    console.log(`This chapters hasn't been found `.yellow);
    not_exist = getDifference(not_exist,exist);
    not_exist.forEach(e => console.log(`${e} ❌`.red))

    //check before download
    if (not_exist.length == 0) {
        console.log('----------------------------------------'.bgGreen);
        console.log(`\nNothing to download 😀`.green);
    }else{
       //download files
        console.log(`\nDownloading chapters ...`);
        not_exist.forEach(capitule => {
            console.log(`${capitule} with link ${result[capitule]} is downloading ...`.green);
            download(result[capitule],folder_name);
        }) 
    }
    

};

async function download_files(name) {
    // get and objet with the data
    const [name_cap,link] = await get_links(name);
    let name_cap_order = name_cap.reverse();
    const result = {};
    name_cap_order.forEach((el,index)=>{
        result[el.slice(5)] = link[index]
    });

    console.log('This are the results:');
    console.log(result);

    //name of folder
    let folder_name = `${__dirname}/files/${name}`;
    
    //check if a folder exists
    console.clear();
    console.log(`\nChecking directory`);
    if (existsSync(folder_name)) {
        console.log('\nDirectory exists!'.yellow);
        console.log('Cheking files ...\n'.yellow);
        await check_and_download(name,folder_name, result)
    } else {
        //if dont exists create one
        console.log('\nDirectory not found.'.yellow)
        console.log('Creating one ...\n');
        //create folder
        mkdir(folder_name, { recursive: true }, (err) => {
            console.log(err);
        });
        await check_and_download(name,folder_name, result);
    }
    
    process.exit(0);
};

// Input

rl.question(`What is the anime's name ? `.yellow, function (name) {
  console.log(`\nWhat do you want with ${name}:`.yellow);
  console.log(`1: Only direct links`.yellow);
  console.log(`2: Download files`.yellow);
  rl.question('\nOption number: '.yellow, async function (op){
    switch (op) {
        case '1':
            await only_links(name);
            process.exit(0);
            break;
        case '2':
            await download_files(name);
            break;
        default:
            console.log("Input Error".red);
            process.exit(0);
            break;
    }
  })
});
