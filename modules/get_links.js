const puppeteer = require('puppeteer');

async function get_links(name){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');

  const anime = `https://www3.animeflv.net/anime/${name}`;
  
  await page.goto(anime);

  const hrefs1 = await page.evaluate(
    () => Array.from(
      document.querySelectorAll('a[href]'),
      a => a.getAttribute('href')
    )
  );

  const links = hrefs1.filter(e => e[0] == '/' && e[1] == 'v');

  const zippy_links = [];

  for (let i = 0; i < links.length; i++) {
    await page.goto(`https://www3.animeflv.net/ver/${name}-${i+1}`);

    const hrefs1 = await page.evaluate(
        () => Array.from(
        document.querySelectorAll('a[href]'),
        a => a.getAttribute('href')
        )
    );

    const links_down = hrefs1.sort();
    const link = links_down[links_down.length - 1];
    zippy_links.push(link)

  };

  /*let a = 1;
  zippy_links.forEach(el => {
    console.log(`Cap ${a}: ` + el);
    a++;
  });*/

  await browser.close();

  return [links,zippy_links]
};

exports.get_links = get_links;
