const puppeteer = require('puppeteer');
const { launch } = require('puppeteer');

const getAllPostUrls = async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto('https://www.instagram.com/finkonsul/');
	// await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)');
	await page.addScriptTag({ path: require.resolve('jquery') });

	const links = await page.evaluate(() => {
		const $ = window.$;
		const subscribers = $('a > span[title]').attr('title');
		let elements = document.querySelectorAll('section > main > div > div > article > div > div > div > div > a[href]');

		var urls = [].map.call(elements, (elem) => {
			elements = "https://www.instagram.com" + elem.getAttribute('href');
			return elements;
		});

		return { subscribers, urls };
	});
	browser.close();
	return links;
};

const getAllDataFromPost = async (url) => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	var data = [];

	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto(url);
	await page.addScriptTag({ path: require.resolve('jquery') });

	const likePhoto = await page.evaluate(() => {
		const $ = window.$;
		const url = $('div > div > div > div > img')[0].src;
		const tag = $('#react-root > section > main > div > div > article > div > div > ul > li:nth-child(1) > div > div > div > span > a');

		var out = $('meta[content]').map((i, elem) => elem.content).toArray().find(item => item.includes('Instagram') && item.includes(','));
		var res = out.split(' — ')[0]
		console.log(res.split(','));

		const likes = res[0];
		const comments = res[1];

		var hashTags = [].map.call(tag, (elem) => {
			elements = elem.innerText;
			return elements;
		});

		var data = { url, hashTags, likes, comments };
		return data;
	});

	data.push(likePhoto);
	browser.close();
	return data;
};

(async () => {

	const data = await getAllPostUrls();
	const result = { data, posts: [] };
	for (url of data.urls) {
		result.posts.push(await getAllDataFromPost(url));
	};

	var myJSON = JSON.stringify(result, null, 2);
	console.log('qqqqqqqq', myJSON);
	return myJSON;
})();

// getAllPostUrls().then(urls => urls.map(url => getAllDataFromPost(url).then(data => console.log(data)))
