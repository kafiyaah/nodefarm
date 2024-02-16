// This is synchronous way of
// This is blocking
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////// Files
// This is synchronous way of
// This is blocking
// const textIN = fs.readFileSync(`./starter/txt/input.txt`, `utf-8`);
// console.log(textIN);
// const textOut = `This is what we know about the avocado: ${textIN}.\nCreated on ${Date.now()}`;
// fs.writeFileSync(`./starter/txt/Output.txt`, textOut);
// console.log('File written');

// This is Asynchronous way
// This is non blocking

// fs.readFile('./starter/txt/start.txt','utf-8', (err, data1) => {
//     fs.readFile(`./starter/txt/${data1}.txt`,'utf-8', (err, data2) => {
// console.log(data2);
// fs.readFile(`./starter/txt/append.txt`,'utf-8', (err, data3) => {
//     console.log(data3);
//     fs.writeFile(`./starter/txt/final.txt`, `${data2}\n${data3}` ,'utf-8', (err) => {
//         console.log('Your file has been written');
//     })
// });
//    });
// });
// console.log(`Will read file!`);

//////////// Server
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8',
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8',
);
const dataObject = JSON.parse(data);
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // Api
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application-json',
    });
    res.end(data);
    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
