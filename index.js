const axios = require("axios");
const cheerio = require("cheerio");
const {
    formatStrings,
    formatDate,
    getCreatedDate
} = require("./utils")

const publisherWeeklyLink = "https://www.publishersweekly.com";
const publisherWeekArchiveIndustryNews = "/pw/by-topic/industry-news/publisher-news/archive.html";
const publisherWeekArchiveBooksExpo = "/pw/by-topic/industry-news/bea/archive.html";

setTimeout(() => {
    console.log('waiting traffic...');
    fetchNews(publisherWeekArchiveIndustryNews);
}, 2000)

fetchNews(publisherWeekArchiveBooksExpo);

function fetchNews(category) {
    async function request() {
        console.log("processing " + publisherWeeklyLink + category + "..");

        const res = await axios.get(`${publisherWeeklyLink}${category}`)
        return res.data
    }
    request().then((res) => {
        const $ = cheerio.load(res)

        $news = $('.article-list ul').children();

        let news = []

        $news.each((_, element) => {
            const $article = $(element)
            const title = formatStrings($article.find('h3').text());
            const dateAndAuthor = $article.find('.article-list-byline-date').text();
            const articleLink = $article.find('a').attr('href');
            const imgLink = $article.find('.image-wrapper img').attr('data-lazysrc');
            const description = formatStrings($article.find('p').text());

            let [author, date] = dateAndAuthor.split('|');
            author = author.replace(/By|by/, '');
            author.trim();
            source = `PublisherWeekly by ${formatStrings(author)}`;
            publishedDate = formatDate(date)
            link = `${publisherWeeklyLink}${articleLink}`
            img = `${publisherWeeklyLink}${imgLink}`

            news.push({
                title,
                source,
                link,
                img,
                description,
                publishedDate
            });

        })
        const createdDate = getCreatedDate()

        const toSave = {
            news,
            createdDate: {
                date: createdDate
            }
        };

        axios({
            url: 'http://localhost:3000/api/news',
            method: 'POST',
            data: toSave
        }).then((res) => {
            console.log("Posted " + category);
        }).catch((err) => {
            console.log(err);
        })

    })
}