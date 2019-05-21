const puppeteer = require('puppeteer');
const { launch } = require('puppeteer');

const getAllPostJobs = async (link) => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto(link);
	await page.addScriptTag({ path: require.resolve('jquery') });

	const data = await page.evaluate(() => {
		const $ = window.$;
		const dateString = document.querySelectorAll('div > div > div > div > span.date')[9].innerText;

		const jobTitles = $('div > div.title > a')
			.toArray().map(elem => elem.innerText);

		const companies = $('td#resultsCol > div > div > div > span')
			.toArray().map(elem => elem.innerText);

		return { companies, jobTitles };
	});

	browser.close();
	return data;
};

const companiesAndVacansies = async (jobtitle, location) => {

	let data = {};
	let result = [];

	const link = `https://www.indeed.com/jobs?q=${jobtitle}&l=${location}&sort=date&start=0`;
	data = await getAllPostJobs(link);
	result.push({ companies: data.companies, vacanies: data.jobTitles });
	var myJSON = JSON.stringify(result, null, 2);
	return myJSON;
}/*)('netsuite', 'usa', 1)*/

module.exports = companiesAndVacansies;
