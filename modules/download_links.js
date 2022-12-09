const puppeteer = require('puppeteer');

async function download_links(link) {

    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

    await page.goto(link);

    const hrefs1 = await page.evaluate( () => 
        Array.from(
          document.querySelectorAll('a[href]'),
          a => a.getAttribute('href')
        )
    );


    const part_of_link = hrefs1.filter(e => e[0]=='/' && e[1] == 'd');
    const start_link = link.slice(0,28)
    const link_for_download = start_link + part_of_link;

    await browser.close();

    return  link_for_download
};

exports.download_links = download_links;