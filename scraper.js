const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const shops = Object.freeze({
  ATB: "АТБ",
  NOVUS: "Новус",
  SILPO: "Сільпо",
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
  new ShopURL(shops.ATB, categories.DAIRY, 'https://www.atbmarket.com/catalog/molocni-produkti-ta-ajca/f/discount'),
  new ShopURL(shops.NOVUS, categories.MEAT, 'https://novus.ua/sales/m-jaso.html'),
  new ShopURL(shops.NOVUS, categories.FRUITS_AND_VEGETABLES, 'https://novus.ua/sales/frukti-ovochi.html'),
  new ShopURL(shops.NOVUS, categories.GROCERY, 'https://novus.ua/sales/bakalija.html'),
  new ShopURL(shops.NOVUS, categories.DAIRY, 'https://novus.ua/sales/molochna-produkcija-jajcja.html'),
  new ShopURL(shops.SILPO, categories.MEAT, 'https://silpo.ua/category/m-iaso-4411?filters=promotion-is-cinotyzhyky-or-svyatkovi-znyzhky'),
  new ShopURL(shops.SILPO, categories.FRUITS_AND_VEGETABLES, 'https://silpo.ua/category/m-iaso-4411?filters=promotion-is-cinotyzhyky-or-svyatkovi-znyzhky'),
  new ShopURL(shops.SILPO, categories.GROCERY, 'https://silpo.ua/category/bakaliia-i-konservy-4870?filters=promotion-is-akciyi-vlasnogo-importu-or-cinotyzhyky'),
  new ShopURL(shops.SILPO, categories.DAIRY, 'https://silpo.ua/category/molochni-produkty-ta-iaitsia-234?filters=promotion-is-cinotyzhyky-or-cinodidjiky'),
]

var products = []

const addScrapedProducts = (shopURL, scrapedProducts) => {
  scrapedProducts.forEach(product => {
    products.push({
      id: Math.random().toString(36).slice(2, 8),
      shop: shopURL.shop,
      category: shopURL.category,
      ...product
    });
  });
};

const scrapeATB = async (shopURL) => {

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    defaultViewport: {width: 1920, height: 1080}
  })
  const page = await browser.newPage()
  await page.goto(shopURL.url)

  const scrapedProducts = await page.evaluate(() => {

    return Array.from(document.querySelectorAll('article.catalog-item')).map(element => {
      const imageUrl = element.querySelector('.catalog-item__img').src
      const title = element.querySelector('.catalog-item__title a').innerText.trim()
      const price = element.querySelector('.product-price__top').getAttribute('value')
      const measureUnit = element.querySelector('.product-price__currency-abbr').innerText.trim()

      return {
        imageUrl,
        title,
        price,
        measureUnit
      };
    });
  });

  addScrapedProducts(shopURL, scrapedProducts);

  await browser.close()
}

const scrapeNovus = async (shopURL) => {

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    defaultViewport: {width: 1920, height: 1080}
  })
  const page = await browser.newPage()
  await page.goto(shopURL.url)

  const scrapedProducts = await page.evaluate(() => {

    return Array.from(document.querySelectorAll('.product-item')).map(element => {
      const imageUrl = element.querySelector('.product-image-photo').src
      const title = element.querySelector('.product-image-photo').alt
      const price = element.querySelector('.price').innerText.replace('\n', '.').replace('\n', ' ')
      const measureUnit = ' - '

      return {
        imageUrl,
        title,
        price,
        measureUnit
      };
    });
  });

  addScrapedProducts(shopURL, scrapedProducts);

  await browser.close()
}

const scrapeSilpo = async (shopURL) => {

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    defaultViewport: {width: 1920, height: 1080}
  })
  const page = await browser.newPage()
  await page.goto(shopURL.url)

  const scrapedProducts = await page.evaluate(() => {

    return Array.from(document.querySelectorAll('.products-list__item')).map(element => {

      const imageUrl = element.querySelector('img').src
      const title = element.querySelector('.product-card__title').innerText
      const price = element.querySelector('.ft-font-bold').innerText
      const measureUnit = element.querySelector('.ft-typo-14-semibold').innerText

      return {
        imageUrl,
        title,
        price,
        measureUnit
      };
    });
  });

  addScrapedProducts(shopURL, scrapedProducts);

  await browser.close()
}

const scrapeShop = async (shopURL) => {
  switch (shopURL.shop) {
    case shops.ATB:
      await scrapeATB(shopURL);
      break;
    case shops.NOVUS:
      await scrapeNovus(shopURL);
      break;
    case shops.SILPO:
      await scrapeSilpo(shopURL);
      break;
    default:
      console.log(`No scraper defined for shop: ${shopURL.shop}`);
  }
}

(async () => {
  
    for (const shopURL of urlList) {
      await scrapeShop(shopURL);
    }

    const filePath = path.join(__dirname, 'products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`Products have been written to ${filePath}`);

})();