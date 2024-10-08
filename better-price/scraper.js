const puppeteer = require('puppeteer');

const shops = Object.freeze({
  ATB: "АТБ",
  SILPO: "Сільпо",
  VARUS: "Варус",
  NOVUS: "Новус",
})

const categories = Object.freeze({
  MEAT: "м'ясо",
  FRUITS_AND_VEGETABLES: "овочі та фрукти",
  GROCERY: "бакалія",
  DAIRY: "молочні продукти та яйця"
})

class ShopURL {
  constructor(shop, category, url) {
    this.shop = shop;
    this.category = category;
    this.url = url;
  }
}

const urlList = [
  new ShopURL(shops.ATB, categories.MEAT, 'https://www.atbmarket.com/catalog/maso/f/discount'),
  new ShopURL(shops.ATB, categories.FRUITS_AND_VEGETABLES, 'https://www.atbmarket.com/catalog/287-ovochi-ta-frukti/f/discount'),
  new ShopURL(shops.ATB, categories.GROCERY, 'https://www.atbmarket.com/catalog/285-bakaliya/f/discount'),
  new ShopURL(shops.ATB, categories.DAIRY, 'https://www.atbmarket.com/catalog/molocni-produkti-ta-ajca/f/discount')
]

var products = []

const scrapeATB = async (shopURL) => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    defaultViewport: {width: 1920, height: 1080}
  })
  const page = await browser.newPage()
  await page.goto(shopURL.url)

  await page.waitForSelector('.catalog-list')

  const scrapedProducts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article.catalog-item')).map(article => {
      const imageUrl = article.querySelector('.catalog-item__img').src
      const title = article.querySelector('.catalog-item__title a').innerText.trim()
      const price = article.querySelector('.product-price__top').getAttribute('value')
      const measureUnit = article.querySelector('.product-price__currency-abbr').innerText.trim()

      return {
        imageUrl,
        title,
        price,
        measureUnit
      }
    })
  })

  scrapedProducts.forEach(product => {
    products.push({
      shop: shops.ATB,
      category: shopURL.category,
      ...product
    })
  })

  await browser.close()

}

(async () => {
  
    for (const shopURL of urlList) {
      await scrapeATB(shopURL);
    }
    console.log(products);

})();