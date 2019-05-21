const puppeteer = require('puppeteer');
const { launch } = require('puppeteer');

const getAllPostJobs = async (link, daysToSearch) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(link);
  await page.addScriptTag({ path: require.resolve('jquery') });

  const data = await page.evaluate((daysToSearch) => {
    const $ = window.$;
    const dateString = document.querySelectorAll('div > div > div > div > span.date')[9].innerText;

    const jobTitles = $('div > div.title > a')
      .toArray().map(elem => elem.innerText);

    const companies = $('td#resultsCol > div > div > div > span')
      .toArray().map(elem => elem.innerText);

    const isLastPage = ((dateString, daysToSearch) => {
      const dateLower = dateString.toLowerCase();

      if (dateLower.includes('today') || dateLower.includes('hours') || dateLower.includes('Just posted')) {
        return false;
      } else {
        const day = dateLower.split(" ")[0];
        return day > daysToSearch;
      };

    })(dateString, daysToSearch);

    return { companies, jobTitles, isLastPage };
  }, daysToSearch);

  browser.close();
  return data;
};


const companiesAndVacansies = async (jobtitle, location, daysToSearch) => {

  let pageCount = 0;
  let data = {};
  let result = [];
  let id = 0;

  do {

    const link = `https://www.indeed.com/jobs?q=${jobtitle}&l=${location}&sort=date&start=${pageCount}`;

    data = await getAllPostJobs(link, daysToSearch);

    result.push(id, { companies: data.companies, vacansies: data.jobTitles });
    pageCount += 10;
    id++;
  } while (!data.isLastPage);
  var myJSON = JSON.stringify(result, null, 2);
  return myJSON;
}

module.exports = companiesAndVacansies;
