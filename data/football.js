const FootballURL = 'https://sports.yahoo.com/nfl/';

const getFootballData = async function (browser) {

  const footballPage = await browser.newPage();
  await footballPage.setViewport({ width: 1366, height: 2500 })
  await footballPage.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36')
  await footballPage.goto(FootballURL, { waitUntil: 'networkidle2' });
  await footballPage.waitForSelector('div#Main');
  await footballPage.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

  let footballResults = await footballPage.evaluate(() => {
    try {
      const $ = window.$; //otherwise the transpiler will rename it and won't work
      let data = [];
      $("li.js-stream-content:not(:first)").each(async function () {
        let link = await $(this).find('a').attr('href').toString();
        let image = await $(this).find('div').find('img').attr('src');
        let title = await $(this).find('h3').text()
        let preview = await $(this).find('p').text()
        let element = {
          title: title,
          preview: preview,
          link: `https://sports.yahoo.com${link}`,
          sport: 'Football',
          image: image,
          hasBeenRead: false
        }
        if (!link.startsWith('http')) {
          data.push(element)
        }
      });
      return data;
    } catch (err) {
      console.log(err.toString());
    }
  });
  return footballResults;
}

module.exports = getFootballData;