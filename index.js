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

fetchNews(publisherWeekArchiveIndustryNews);
fetchNews(publisherWeekArchiveBooksExpo);

function fetchNews(category) {
    async function request() {
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
            const articleLink = $article.find('li a').attr('href');

            let [author, date] = dateAndAuthor.split('|');
            author = author.replace(/By|by/, '');
            author.trim();
            source = `PublisherWeekly by ${formatStrings(author)}`;
            publishedDate = formatDate(date)
            link = `${publisherWeeklyLink}${articleLink}`

            news.push({
                title,
                source,
                link,
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